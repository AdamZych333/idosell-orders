## Requirements
- Node.js: Version 16.10.0 or later
- MySQL Database: Version 8.0 or later

## Installation
1. Navigate to the project directory and run: `npm install`.
2. After running npm install, you'll be prompted with two questions in your terminal. Answer "JavaScript" to the first question and "CommonJS" to the second.
3. Create a `.env` file based on the `.env-example` file and fill in the following:
  - `IDOSELL_API_KEY`: api key
  - `ORDERS_SOURCE_URL`: api domain
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`: database credentials

## Start up
Start the server by running `npm start` in the main directory.

The server will be accessible at `http://127.0.0.1:3000`

On initial startup, the database schema will be created and initial data will be fetched from the Idosell API. Subsequent fetches will occur daily at midnight server time.

## Available endpoints
`/order` - fetches a list of all orders.

  Query params:
    `minWorth`: minimum order worth
    `maxWorth`: maximum order worth

`/order/:orderID` - fetches a specific order by its ID.

`/order/download` - downloads all orders as a CSV file.

  Query params:
    `minWorth`: minimum order worth
    `maxWorth`: maximum order worth

These endpoints are secured with basic authentication. To access them, you'll need to add an `Authorization` header to your requests. The header value should be a base64-encoded string of `username:password`.
