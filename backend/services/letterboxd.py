import logging
import itertools
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
        raise Exception("You need at least two users that have a letterboxd account.")

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


def create_set_slug(k, users: set[User]) -> set[str]:
    """
    Use when you want to create a set containing slug movies in k person's watchlist in the total of person's watchlist
    :param k: the number of people that must have a film to be in the return set
    :param users: a list of user object
    :return: set of slug movies
    """
    n_union = set()

    for n_tuples in itertools.combinations(users, k):
        tuple_intersection = set()

        for use in n_tuples:

            if tuple_intersection == set():
                tuple_intersection = get_slug_watchlist(use)

            tuple_intersection &= get_slug_watchlist(use)

        n_union = n_union.union(tuple_intersection)

    return n_union
