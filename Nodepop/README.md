# NodePop

## Deploy

### Install dependencies

```sh
npm install
```
On first deploy copy.env.example to .env and customize enviroment variables.

```sh
cp .env.example .env
```

 You can run next command to empty the database and create initial data:

```js
npm run initDB
```

## Start

To start in production mode:

```sh
npm start
```

To start in development mode:

```sh
npm run dev
```

## API

Base URL :http://localhost:3000/api

## Products list

GET /api/products

```json

    {
        "results": [
            {
                "_id": "67a0f33607eab4b6998a3699",
                "name": "Teclado",
                "price": 122,
                "owner": "67a0a910dbd8fd027c3bbd2a",
                "image": "image-1738601270897-wp2345891.jpg",
                "tags": [
                    "work"
                ],
                "__v": 0
            }
        ],
        ...
        "count": 1
    }

```