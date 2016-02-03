#!/bin/sh

usage () {
  echo "Usage: vrbose-client <url> <topic> <level> <log> <author>"
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
  log="{\"log\":{\"topic\":\""$2\"",\"level\":\""$3\"",\"data\":\""$4\"",\"createdBy\":\""$5\""}}"
  echo "Writing $log to $1"
  curl -H "Content-Type: application/json" -X POST -d "$log" $1
fi
