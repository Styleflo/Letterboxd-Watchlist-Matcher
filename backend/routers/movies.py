import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from letterboxdpy.core.exceptions import AccessDeniedError
import math

try:
    from backend.services.letterboxd import get_movie_from_slug, get_slug_watchlist, verify_users, create_set_slug
    from backend.core.exceptions import UserValidationError, InsufficientInputError
except ModuleNotFoundError:
    from services.letterboxd import get_movie_from_slug, get_slug_watchlist, verify_users, create_set_slug
    from core.exceptions import UserValidationError, InsufficientInputError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/movies", tags=["Movies"])


class WatchlistIntersectRequest(BaseModel):
    usernames: list[str]


@router.post("/watchlist/intersect")
async def intersect_watchlist(payload: WatchlistIntersectRequest):
    """
    Fetch watchlist for multiple Letterboxd users and return common movies.
    """
    try:
        users = verify_users(payload.usernames)
        user_list = [user.username for user in users]
        nb_users = len(users)

        slug_watchlist_intersections = {nb_users: create_set_slug(nb_users, users)}
        all_slugs = slug_watchlist_intersections[nb_users].copy()

        if nb_users > 2 and not all_slugs:
            min_users = math.ceil(nb_users / 2)
            keys_desc = list(range(nb_users - 1, min_users - 1, -1))

            for n in keys_desc:
                n_slug = create_set_slug(n, users)
                # this order matters, to convince yourself write a superposition groups
                slug_watchlist_intersections[n] = n_slug.difference(all_slugs)
                all_slugs.update(n_slug)

        correspond = {}
        for slug in all_slugs:
            correspond[slug] = get_movie_from_slug(slug)

        result = {}
        total_movies_count = 0

        for key, values in slug_watchlist_intersections.items():
            movie_list = []
            for val in values:
                movie_list.append(correspond[val])
                total_movies_count += 1

            result[str(key)] = {
                "label": f"Shared by {key}/{nb_users} users",
                "count": len(movie_list),
                "movies": movie_list
            }

        logger.info(
            f"Intersection completed successfully. Found {total_movies_count} movies across {len(result)} tiers."
        )

        return {
            "users_checked": user_list,
            "total_users": nb_users,
            "total_movies_found": total_movies_count,
            "movies": result,
        }

    except InsufficientInputError as e:
        logger.warning(f"Client input error: {e}")
        raise HTTPException(
            status_code=400,
            detail={
                "code": e.code,
                "message": str(e),
            },
        )

    except UserValidationError as e:
        logger.warning(f"User validation failed: {e}")
        raise HTTPException(
            status_code=422,
            detail={
                "code": e.code,
                "message": str(e),
                "not_found": e.not_found,
                "private": e.private,
            },
        )

    except AccessDeniedError as e:
        logger.warning(f"Domain verification error: {e}")
        raise HTTPException(
            status_code=400,
            detail={
                "message": str(e),
            },
        )

    except Exception as e:
        logger.error(f"Unexpected error while processing watchlists: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred while processing the request.",
        )
