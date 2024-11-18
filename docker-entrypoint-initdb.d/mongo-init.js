console.log("Started Adding the Users.");
db = db.getSiblingDB("admin");
db.createUser({
  user: "mongo",
  pwd: "password",
  roles: [{ role: "root", db: "admin" }],
});
console.log("End Adding the User Roles.");