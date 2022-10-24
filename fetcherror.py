#!/usr/bin/env python3
import json
import requests
import urllib
import os
import traceback
with open("websites/logs/wiki.hosiken.jp.log.json", "r") as f:
    j = f.read()
log = json.loads(j)
for l in log:
    if l["ErrorMsg"]:
        try:
            res = requests.get(l["Source"])
            path = l["Source"]
            if ".jp:80/" in path:
                path = path[path.find(".jp:80/")+7:]
            if ".jp/" in path:
                path = path[path.find(".jp/")+4:]
            path = urllib.parse.unquote(path, encoding="euc-jp")
            path = urllib.parse.unquote(path, encoding="euc-jp")
            path = path.replace("?", "")
            path = "websites_utf8/wiki.hosiken.jp/" + path
            os.makedirs(path, exist_ok=True)
            with open(path + "/index.html", "wb") as f:
                f.write(res.content)
        except:
            print(path)
            traceback.print_exc()
