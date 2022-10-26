#!/usr/bin/env python3
import glob
import os
import os.path
import traceback
import shutil
for dir in ["petc", "petc3gou", "petc4"]:
    root = "./websites_utf8/wiki.hosiken.jp/" + dir + "/"
    target = "./public/ref/" + dir + "/"
    for fn in glob.glob("plugin=ref&*/**/*", root_dir=root, recursive=True):
        if not os.path.isfile(root + fn):
            continue
        if "src=" not in fn:
            continue
        page = fn[len("plugin=ref&page="): fn.find("&", len("plugin=ref&page="))]
        src = fn[fn.find("src=") + 4: fn.rfind("/")]
        os.makedirs(target + page, exist_ok=True)
        shutil.copyfile(root + fn, target + page + "/" + src)
        os.remove(root + fn)
    for fn in glob.glob("plugin=attach&*/**/*", root_dir=root, recursive=True):
        if not os.path.isfile(root + fn):
            continue
        if "openfile=" not in fn:
            continue
        page = fn[len("plugin=attach&refer="): fn.find("&", len("plugin=attach&refer="))]
        src = fn[fn.find("openfile=") + 9: fn.rfind("/")]
        os.makedirs(target + page, exist_ok=True)
        shutil.copyfile(root + fn, target + page + "/" + src)
        os.remove(root + fn)
