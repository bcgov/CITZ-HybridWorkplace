#!/bin/bash

echo "########### Loading data to Mongo DB ###########"
#mongoimport --jsonArray --db TheNeighbourhood --collection user --file /tmp/data/users.json
mongoimport --jsonArray --db TheNeighbourhood --collection community --file /tmp/data/communities.json
#mongoimport --jsonArray --db TheNeighbourhood --collection post --file /tmp/data/posts.json
