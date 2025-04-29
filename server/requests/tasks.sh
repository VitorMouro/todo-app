#!/bin/bash

URL="localhost:3000"

curl -X GET $URL/api/tasks -H "Accept: application/json" \
     -H "Authorization: Bearer $(cat token.txt)" \
