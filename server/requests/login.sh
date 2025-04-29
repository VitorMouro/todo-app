#!/bin/bash

URL="localhost:3000"

curl -X POST $URL/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "user@example.com",
           "password": "password"
        }' \
     -s \
    | tee /dev/tty \
    | jq -r '.token' \
    > token.txt


