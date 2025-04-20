#!/bin/bash

URL="localhost:3000"

curl -X POST $URL/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "user@example.com",
           "password": "password"
         }'
