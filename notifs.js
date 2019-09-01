const deasync = require("deasync");
const db = require("./db");

// Wait for a promise without using the await
function wait(promise) {
  var done = 0;
  var result = null;
  promise.then(
    // on value
    function(value) {
      done = 1;
      result = value;
      return value;
    },
    // on exception
    function(reason) {
      done = 1;
      throw reason;
    }
  );

  while (!done) deasync.runLoopOnce();

  return result;
}

const UserDetails = () => {
  const obj = wait(db.userinfo.find({}));
  return obj;
};

const ExercisesQuery = query => {
  return wait(db.exercises.find(query));
};

const getUserDetails = () => {
  return UserDetails()[0].data;
};

var User = getUserDetails();

const getUserPosture = space => {
  if (space.startsWith("Small")) {
    return "stand";
  } else {
    return "lay";
  }
};

module.exports = {
  getNormalPlan: () => {
    let plans = ExercisesQuery({
      orien: getUserPosture(User.roomspc),
      prof: User.prof.toLowerCase()
    });
    return plans[Math.floor(Math.random() * plans.length)];
  },

  getPosturePlans: () => {
    if (User.orientation === "sit") {
      let plans = ExercisesQuery({
        orien: getUserPosture(User.roomspc),
        prof: User.prof.toLowerCase()
      });
      return plans[Math.floor(Math.random() * plans.length)];
    }
  }
};
