from urllib.request import urlopen

url = urlopen("http://www.justa999.com/readNetFile.py")
for line in url:
    print(line )
