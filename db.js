const { app } = require("electron");

const Datastore = require("nedb-promises");
const dbFactory = fileName =>
  Datastore.create({
    filename: `./data/${fileName}`,
    timestampData: true,
    autoload: true
  });

const db = {
  userinfo: dbFactory("userinfo.db"),
  appmetadata: dbFactory("appmeta.db"),
  exercises: dbFactory("exercises.db")
};

module.exports = db;
