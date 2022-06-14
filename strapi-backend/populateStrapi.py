from pathlib import Path
from datetime import datetime
import requests
import csv
import os
import json 

currentDir = os.getcwd()

def loadMangas():

    with open(os.path.join(currentDir, '../backend/db/mangas.csv'), newline='') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',')
        for row in spamreader:
            manga = {
                "title": row["title"],
                "number": int(row["volumeNumber"]),
                "price": round(float(row["price"]), 2),
                "publishedAt": datetime.now().isoformat()
            }
            
            
            filename = os.path.basename(row["cover.href"])
            filepath = os.path.realpath(os.path.join(currentDir, "../backend/public/img/one_piece/{}".format(filename)))
            files = {'files': open(filepath, 'rb')} 
            response = requests.post("http://localhost:1337/api/mangas",  json={"data": manga})
            id = response.json()["data"]["id"]

            response  = requests.post("http://localhost:1337/api/upload", files=files, data={"refId": id, "field": "cover", "ref": "api::manga.manga"})
            print(manga)
    

loadMangas()

