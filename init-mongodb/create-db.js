// Create DB and collection
db = new Mongo().getDB("TheNeighborhood");
db.createCollection("user-data", { capped: false });
db.createCollection("community-data", { capped: false });
db.createCollection("post-data", { capped: false });
