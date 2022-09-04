### 1. Переименовать example.env в .env

### 2. Запустить проект

docker-compose -f docker-compose.dev.yml up --build -d

### Очистить базу:

docker-compose down
rm -fr docker-data/postgres
docker-compose -f docker-compose.dev.yml up --build -d
