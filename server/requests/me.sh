#!/bin/bash

URL="localhost:3000"

curl -X GET $URL/api/me -H "Accept: application/json"
