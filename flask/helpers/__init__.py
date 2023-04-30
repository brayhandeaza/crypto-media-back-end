import requests
from bs4 import BeautifulSoup
import json

# sources
SOURCES = {
    "62756C65": "xxxbule",
    "76696B69": "vikiporn",
}

#########################$$$$$$$$$$$$$$###########################
# http://xxxbule.com
##################################################################
def fetch_xxxbule(query):
    url = f"http://www.xxxbule.com/find/4k-{query}/"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    tags = soup.select(".style47")

    videos = []
    for tag in tags:
        tag.select(".style49")

        video_id = tag.attrs.get("data-id")

        if video_id:
            title = BeautifulSoup(tag.__str__(), "html.parser").select_one(".style49").text
            src = f"http://www.xxxbule.com/videos/{video_id}/{title.replace(' ', '-').lower()}.mp4"
            thumb = "http://www.xxxbule.com" + BeautifulSoup(tag.__str__(), "html.parser").find("img")["src"]

            data = {
                "box_id": video_id,
                "source_id": "62756C65",
                "source_url": "www.xxxbule.com",
                "thumb": thumb,
                "title": title,
                "title_id": title.replace(" ","-").lower(),
                "url": f"https://www.xxxbule.com/sex-clips/{title}".replace(" ","-").lower(),
                "video_id": video_id,
                "video_url": src,
            }

            videos.append(data)

    return videos

def fetch_xxxbule_single_video(video_id):
    url = f"http://www.xxxbule.com/sex-clips/{video_id}"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    tag = soup.select_one("script")
    data = json.loads(tag.getText())
    
    if ("contentUrl" in data and "thumbnailUrl" in data and "description" in data and "keywords" in  data):
        video = {
            "source": "www.xxxbule.com",
            "video_url": data["contentUrl"],
            "description": data["description"],
            "thumb": data["thumbnailUrl"],
            "keywords": str(data["keywords"]).split(","),
        }
        return video
    else:
        return False
 

##################################################################
# http://vikiporn.com
##################################################################
def fetch_vikiporn(query):
    # Make a GET request to the webpage
    url = f'https://www.vikiporn.com/search/?q={query}'
    response = requests.get(url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    tags = soup.select(".thumbs-list .thumb")
    videos = []

    for tag in tags:
        video = tag.select_one(".img")
        info = tag.select_one(".info-inner")
        url = tag.select_one("a")["href"]
        box_id = video["data-src"].replace("https://cdn.vikiporn.com/contents/videos/", "").replace("_preview.mp4", "").split("/")[0]
        title = info.select_one("h3").getText()

        data = {
            "source_url": "www.vikiporn.com",
            "source_id": "76696B69",
            "video_id": video["data-id"],
            "url": url,
            "video_url": video["data-src"].replace("_preview", ""),
            "box_id": box_id,
            "thumb": video["data-poster"],
            "title": title,
            "title_id": title.replace(" ","-").lower()
        }
        videos.append(data)

    return videos

def fetch_vikiporn_single_video(box_id, video_id, title_id):
    url = f'https://www.vikiporn.com/videos/{video_id}/{title_id}/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    tags = soup.select(".player meta")

    video = {
        "box_id": box_id,
        "video_id": video_id,
        "title_id": title_id,
        "video_url": f"https://cdn.vikiporn.com/contents/videos/{box_id}/{video_id}/{video_id}.mp4"
    }

    for tag in tags:
        if (tag["itemprop"] == "description" or tag["itemprop"] == "thumbnailUrl") or tag["itemprop"] == "name" or tag["itemprop"] == "keywords":
            if tag["itemprop"] == "keywords":
                video["keywords"] = tag["content"].split(", ")

            elif tag["itemprop"] == "thumbnailUrl":
                video["thumb"] = tag["content"]

            else:
                video[tag["itemprop"]] = tag["content"]
     
    return video