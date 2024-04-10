import requests
from bs4 import BeautifulSoup


async def scrape_from_url(url: str):
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract the desired data from each element
        extracted_data = []

        target_div = soup.find("div", class_="description current-news-block")

        if target_div:
            paragraphs = target_div.find_all("p")  # type: ignore

            # Access and process the paragraphs
            for paragraph in paragraphs:
                extracted_data.append(
                    paragraph.text
                )  # Print the text content of each paragraph
        else:
            print("Div with given class name not found.")

        return extracted_data

    else:
        print(f"Error: Failed to download webpage. Status code: {response.status_code}")
        return None
