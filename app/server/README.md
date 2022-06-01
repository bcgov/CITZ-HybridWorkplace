# Getting the server running locally

## Without Nodemon

If you want to run the server without nodemon, then use: `npm start`

## With Nodemon

Having to restart the server after every change can be tedious. We use nodemon to automatically restart the server and show our most recent changes.

To run the server locally with nodemon, type this into the terminal: `npm run dev`

## API Documentation

The API is documented using Swagger (OpenAPI v3.0.0).\
Open [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to view it in your browser.

The basic setup for swagger is done in ./express.js\
and configured in ./swagger-conf.js\
Data model documentation is done in the ./models/_.model.js files.\
Endpoint documentation is done in the ./routes/v1/_.js files.

## Setting Version

Set the current used version in the .env file with API_VERSION.

## Creating New Versions

- Create new versions by making a new version directory in ./routes
- Import the new routes into ./express.js
- In ./express.js, copy the 'useV1()' function under the 'Version 1 routes' comment.
  Paste underneath, change the function name appropriately, and replace the routes.
- In ./express.js, add the version inside of the 'routesVersioning()' call,
  which is near the bottom of the file under the 'Route to version' comment.
  Be sure to call the function you just created.
