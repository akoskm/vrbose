#!/bin/sh

usage () {
  echo "Usage: vrbose-client <url> <topic> <level> <message> <author>"
}

if [ $# -eq 0 ]
  then
    echo "No arguments supplied."
    usage
elif [ $# -lt 5 ]
  then
    echo "Not enough arguments"
    usage
else
  message="{\"message\":{\"topic\":\""$2\"",\"type\":\""$3\"",\"data\":\""$4\""},\"createdBy\":\""$5\""}"
  echo "Writing $message to $1"
  curl -H "Content-Type: application/json" -X POST -d "$message" $1
fi
