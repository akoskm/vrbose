#vrbose

## Setup
See config.js for db setup and configuration. Install the dependecies with `npm install` then run the app with `npm start`.

## Read
Query parameters:

1. skip: number
1. limit: number

### example request:
```
curl http://0.0.0.0:3030/read
```

## Write
vrbose expects the request body to be an object with the following properties:

1. message: object (required)
1. createdBy: string (required)
1. createdOn: date (optional)

### example request

```
curl -H "Content-Type: application/json" -X POST -d '{"data":"dev deployment started", "createdBy": "git-hook"}' http://0.0.0.0:3030/write
```
