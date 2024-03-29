# Getting Started

### 1. Install dependencies
```bash
npm i
```

### 2. Create `.env` file
```
MLA_PORT=[PORT]
PROXY_URL=[URL FOR RELOAD]
PROXY_USERNAME=[PROXY USER NAME]
PROXY_PASSWORD=[PROXY PASSWORD]
```

### 3. Set port in multilogin app
[Instructions](https://docs.multilogin.com/l/en/article/el0fuhynnz-a-quick-guide-to-starting-browser-automation)

### 4. Put videos in `videos` folder

### 5. Create `videos.json` file
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

### 6. Create `profiles.json` file
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

### 7. Create `config.json` file
```json
{
    "startProfileId": 0,
    "startVideoId": 0
}
```

### 8. Run the multilogin

### 9. Launch bot
```bash
npm start
```
