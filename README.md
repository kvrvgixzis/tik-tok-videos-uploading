# Get started

### install dependences
```bash
npm i
```

### create `.env` file
```
MLA_PORT=[PORT]
PROXY_URL=[URL FOR RELOAD]
PROXY_USERNAME=[PROXY USER NAME]
PROXY_PASSWORD=[PROXY PASSWORD]
```

### set port in multilogin
[instruction](http://docs.multilogin.com/l/en/article/el0fuhynnz-a-quick-guide-to-starting-browser-automation)

### put videos in videos folder

### create `videos.json` file
```json
{
  "videos": [
    {
      "id": "0",
      "videoPath": "./videos/id0.mp4",
      "head": "***",
      "tags": [
        "#***",
        "#***"
      ]
    },
    {
      "id": "1",
      "videoPath": "./videos/id0.mp4",
      "head": "***",
      "tags": [
        "#***",
        "#***"
      ]
    }
   ]
 }
```

### create `profiles.json` file
```json
{
  "profiles": [
     {
        "id": "0",
        "mlId": "****"
     },
     {
        "id": "1",
        "mlId": "****"
     }
    ]
 }
```

### run bot
```bash
npm start
```
