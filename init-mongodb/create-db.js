/*// Create user
dbAdmin = db.getSiblingDB("admin");
dbAdmin.createUser({
  user: "bardy",
  pwd: "bardy",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }],
  mechanisms: ["SCRAM-SHA-1"],
});

// Authenticate user
dbAdmin.auth({
  user: "bardy",
  pwd: "bardy",
  mechanisms: ["SCRAM-SHA-1"],
  digestPassword: true,
});*/

// Create DB and collection
db = new Mongo().getDB("TheNeighborhood");
db.createCollection("user-data", { capped: false });
db.createCollection("community-data", { capped: false });
db.createCollection("post-data", { capped: false });
