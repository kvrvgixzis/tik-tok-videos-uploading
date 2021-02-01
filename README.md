# Get started

### 1. install dependences
```bash
npm i
```

### 2. create `.env` file
```
MLA_PORT=[PORT]
PROXY_URL=[URL FOR RELOAD]
PROXY_USERNAME=[PROXY USER NAME]
PROXY_PASSWORD=[PROXY PASSWORD]
```

### 3. set port in multilogin
[instruction](http://docs.multilogin.com/l/en/article/el0fuhynnz-a-quick-guide-to-starting-browser-automation)

### 4. put videos in videos folder

### 5. create `videos.json` file
```json
{
  "videos": 
    [
      {
        "id": "0",
        "videoPath": "./videos/**.mp4",
        "head": "***",
        "tags": 
        [
          "#***",
          "#***"
        ]
      },
      {
        "id": "1",
        "videoPath": "./videos/**.mp4",
        "head": "***",
        "tags": 
        [
          "#***",
          "#***"
        ]
      }
    ]
 }
```

### 6. create `profiles.json` file
```json
{
  "profiles": 
    [
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

### 7. create `config.json` file
```json
{
    "startProfileId": 0,
    "startVideoId": 0
}
```

### 8. run bot
```bash
npm start
```
