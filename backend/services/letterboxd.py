import logging
from letterboxdpy.user import User
from letterboxdpy.movie import Movie
from sentry_sdk.logger import warning

logger = logging.getLogger(__name__)


def verify_users(usernames: list[str]) -> set[User]:
    if not usernames or len(usernames) < 2:
        raise Exception("You need at least two users.")

    # We verify every user exist (no miss click...)
    user_list = set()
    for username in usernames:
        logger.info(f"Verifying the existence of Letterboxd profile for user: {username}")
        try:
            u = User(username)
            user_list.add(u)

        except Exception as e:
            logger.warning(f"Error {e} for the user '{username}'.")
            pass

    if len(user_list) < 2:
        raise Exception("You need at least too users that have a letterboxd account.")

    return user_list


def get_slug_watchlist(u: User) -> set[str]:
    user_watchlist = u.get_watchlist()
    if user_watchlist:
        watchlist = list(user_watchlist['data'].values())
        slug_watchlist = set()
        for value in watchlist:
            slug_watchlist.add(value['slug'])
        return slug_watchlist
    return set()


def get_movie_from_slug(slug: str):
    m = Movie(slug)

    return {
        "title": m.get_title(),
        "letterboxd_url": m.get_url(),
        "poster": m.get_poster(),
        "year": m.get_year(),
        "summary": m.get_description(),
    }
