import requests
from bs4 import BeautifulSoup
import time
import random

USER = "FrancoisGb"
BASE_URL = f"https://letterboxd.com/{USER}/watchlist/"
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

session = requests.Session()
session.headers.update(HEADERS)

response = requests.get(BASE_URL)
html = response.text

soup = BeautifulSoup(html, "html.parser")
pages = soup.select(".paginate-pages .paginate-page")

if pages:
    last_page = int(pages[-1].get_text(strip=True))
else:
    last_page = 1  # une seule page

print("Nombre de pages :", last_page)

films = []
for page in range(1, last_page+1) :
    print(f"Récuperation de la page : {page}")
    response = requests.get(f"{BASE_URL}page/{page}/")
    html = response.text
    with open(f"output_{page}.txt", "w", encoding="utf-8") as f:
        f.write(html)
    soup = BeautifulSoup(html, "html.parser")
    for item in soup.select("li.griditem div.react-component"):
        title = item.get("data-item-name")
        if title:
            films.append(title)
    # time.sleep(random.uniform(1.2, 4))

print(films)
print(len(films))
