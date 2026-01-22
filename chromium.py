from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

BASE_URL = "https://letterboxd.com"
BASE_POSTER_URL = "https://a.ltrbxd.com/resized/film-poster"


async def get_watchlist(user: str):
    user_url = f"{BASE_URL}/{user}/watchlist/"
    res_json = {"user": user, "watchlist": []}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Première page pour connaître le nombre total de pages
        await page.goto(user_url)
        await page.wait_for_selector("li.griditem")
        html = await page.content()
        soup = BeautifulSoup(html, "html.parser")

        pages = soup.select(".paginate-pages a")
        page_numbers = [int(a.text) for a in pages if a.text.isdigit()]
        total_pages = max(page_numbers) if page_numbers else 1
        print(f"Nombre total de pages : {total_pages}")

        # Boucle sur toutes les pages
        for page_number in range(1, total_pages + 1):
            url = f"{user_url}page/{page_number}/"
            print(f"Récupération page {page_number}")

            await page.goto(url, wait_until="networkidle")
            await page.wait_for_selector("li.griditem")
            html = await page.content()

            soup = BeautifulSoup(html, "html.parser")
            for item in soup.select("li.griditem div.react-component"):
                film_name = item.get("data-item-name")
                film_id = item.get("data-film-id")
                film_data_name = item.get("data-item-slug")

                grid_item = item.find_parent("li", class_="griditem")
                img = grid_item.select_one("div.poster img") if grid_item else None
                film_poster_url = img.get("src") if img else None

                res_json["watchlist"].append({
                    "name": film_name,
                    "id": film_id,
                    "data-name": film_data_name,
                    "poster_url": film_poster_url
                })

        await browser.close()

    print(f"\nTotal films récupérés : {len(res_json['watchlist'])}")
    return res_json
