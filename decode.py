import glob
import urllib.parse
import os
import traceback
import shutil
for fn in glob.glob("**/index.html", root_dir="./websites/", recursive=True):
    fn_new = urllib.parse.unquote(fn, encoding="euc-jp")
    fn_new = urllib.parse.unquote(fn_new, encoding="euc-jp")
    os.makedirs(os.path.dirname("./websites_utf8/" + fn_new), exist_ok=True)
    shutil.copyfile("./websites/" + fn, "./websites_utf8/" + fn_new)
