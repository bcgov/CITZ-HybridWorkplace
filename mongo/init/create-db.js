/* eslint-disable no-undef */
// Create DB and collection
db = new Mongo().getDB("TheNeighbourhood");

db.createUser({
  user: "db-admin",
  pwd: "db-admin",
  roles: [{ role: "readWrite", db: "TheNeighbourhood" }],
});

db.createCollection("user", { capped: false });
db.createCollection("community", { capped: false });
db.createCollection("post", { capped: false });
db.createCollection("comment", { capped: false });
