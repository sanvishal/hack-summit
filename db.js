const { app } = require("electron");

const Datastore = require("nedb-promises");
const dbFactory = fileName =>
  Datastore.create({
    filename: `${
      process.env.NODE_ENV === "dev" ? "." : app.getAppPath("userData")
    }/data/${fileName}`,
    timestampData: true,
    autoload: true
  });

const db = {
  userinfo: dbFactory("userinfo.db"),
  appmetadata: dbFactory("appmeta.db"),
  exercises: dbFactory("exercises.db")
};

module.exports = db;
