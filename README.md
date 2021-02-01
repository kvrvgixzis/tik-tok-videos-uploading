# Первый запуск

### 1. Установить зависимости
```bash
npm i
```

### 2. Создать `.env` файл
```
MLA_PORT=[PORT]
PROXY_URL=[URL FOR RELOAD]
PROXY_USERNAME=[PROXY USER NAME]
PROXY_PASSWORD=[PROXY PASSWORD]
```

### 3. Установить порт в мультилогине
[Инструкция](http://docs.multilogin.com/l/ru/article/el0fuhynnz-a-quick-guide-to-starting-browser-automation)

### 4. Положить видео в папку `videos`

### 5. Создать `videos.json` файл
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

### 6. Создать `profiles.json` файл
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

### 7. Создать `config.json` файл
```json
{
    "startProfileId": 0,
    "startVideoId": 0
}
```

### 8. Запустить мультилогин

### 9. Запустить бот
```bash
npm start
```
