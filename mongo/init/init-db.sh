#!/bin/bash

echo "########### Loading data to Mongo DB ###########"
mongoimport --jsonArray --db TheNeighborhood --collection user-data --file /tmp/data/users.json
mongoimport --jsonArray --db TheNeighborhood --collection community-data --file /tmp/data/communities.json
mongoimport --jsonArray --db TheNeighborhood --collection post-data --file /tmp/data/posts.json

