import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

try:
    from backend.services.letterboxd import get_movie_from_slug, get_slug_watchlist, verify_users
except ModuleNotFoundError:
    from services.letterboxd import get_movie_from_slug, get_slug_watchlist, verify_users

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

        slug_watchlist_intersection = set()
        for user in users:
            if slug_watchlist_intersection == set():
                slug_watchlist_intersection = get_slug_watchlist(user)
            slug_watchlist_intersection = slug_watchlist_intersection & get_slug_watchlist(user)

        result = []
        for slug in slug_watchlist_intersection:
            result.append(get_movie_from_slug(slug))

        logger.info(
            f"Intersection completed successfully. Found {len(result)} common movies."
        )

        return {
            "users_checked": [user.username for user in users],
            "common_count": len(result),
            "common_movies": result,
        }

    except Exception as e:
        logger.error(
            f"An error occurred while processing watchlists: {str(e)}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching Letterboxd data: {str(e)}",
        )
