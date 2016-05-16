#!/bin/sh

usage () {
  echo "Usage: vrbose-client <url> <message> <author> <topic> <level>"
}

if [ $# -eq 0 ]
  then
    echo "No arguments supplied."
    usage
elif [ $# -lt 2 ]
  then
    echo "Not enough arguments"
    usage
else
  log="{\"topic\":\""$4\"",\"level\":\""$5\"",\"message\":\""$2\"",\"author\":\""$3\""}"
  echo "Writing $log to $1"
  curl -H "Content-Type: application/json" -X POST -d "$log" $1
fi
