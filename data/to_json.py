from codecs import ascii_encode
import json
import csv

json_list = []

# CSV ファイルの読み込み
with open('editable.csv', encoding='utf-8', mode='r') as f:
    for row in csv.DictReader(f):
        json_list.append(row)

# JSON ファイルへの書き込み
with open('../src/video.json', encoding='utf-8', mode='w') as f:
    dic = {"videos": json.loads(json.dumps(json_list))}
    f.write(json.dumps(dic))
