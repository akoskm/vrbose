#vrbose

## Setup
See config.js for db setup and configuration. Install the dependecies with `npm install` then run the app with `npm start`.

## Reading log messages
Query parameters:

1. skip: number
1. limit: number

### example request:
```
curl http://0.0.0.0:3030/read
```

## Creating new log messages
vrbose expects the request body to be an object with the following properties:

1. message: object (required)
1. author: string (optional)
1. level: string (optional)
1. topic: string (optional)

### example request

```
curl -H "Content-Type: application/json" -X POST -d '{"message":"dev deployment started", "author": "git-hook"}' http://0.0.0.0:3030/write
```
