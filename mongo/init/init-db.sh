#!/bin/bash

echo "########### Loading data to Mongo DB ###########"
mongoimport --jsonArray --db $MONGO_DATABASE_NAME --collection community --file /tmp/data/communities.json
