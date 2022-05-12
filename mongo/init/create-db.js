// Create DB and collection
db = new Mongo().getDB("TheNeighborhood");

db.createUser(
  {
    user: 'db-admin',
    pwd: 'db-admin',
    roles: [{ role: 'readWrite', db: 'TheNeighborhood' }],
  },
);

db.createCollection("user-data", { capped: false });
db.createCollection("community-data", { capped: false });
db.createCollection("post-data", { capped: false });
