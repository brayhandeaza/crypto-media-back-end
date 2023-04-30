import requests
from bs4 import BeautifulSoup
import json

box_id = "183000"
video_id = "165418"
title_id = "college-teen-anal-sex-4k"

# https://cdn.vikiporn.com/contents/videos/183000/183514/183514.mp4

# Make a GET request to the webpage
url = f'https://www.vikiporn.com/videos/{video_id}/{title_id}/'
response = requests.get(url)

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.content, 'html.parser')

tags = soup.select(".player meta")

video = {
    "box_id": "183000",
    "video_id": "183514",
    "title_id": "college-teen-anal-sex-4k",
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
            
    
print(json.dumps(video, indent=4))