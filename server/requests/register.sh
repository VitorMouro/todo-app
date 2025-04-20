#!/bin/bash

URL="localhost:3000"

curl -X POST $URL/auth/register \
     -H "Content-Type: application/json" \
     -d '{
           "name": "John Doe",
           "email": "user@example.com",
           "password": "password"
         }'
