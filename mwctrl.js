const db = require("./db");

const UserReg = async data => {
  const obj = await db.userinfo.insert({ data });
  return obj;
};

let isfirst = localStorage.getItem("isfirst", true);
if (!isfirst) {
  document.getElementById("dashboard-wrap").style.display = "none";
} else {
  document.getElementById("form-wrap").style.display = "none";
  document.getElementById("dashboard-wrap").style.display = "block";
}

let submitbtn = document.getElementById("submit-btn");
let form = document.getElementById("form-wrap");

submitbtn.addEventListener("click", e => {
  var name = document.getElementById("name-ipc").value;
  var gender = document.getElementById("gender-ipc").value;
  if (document.getElementById("standing-desk-ipc").checked) {
    var standing = document.getElementById("standing-desk-ipc").value;
  }
  if (document.getElementById("sit-ipc").checked) {
    var sit = document.getElementById("sit-ipc").value;
  }
  var roomspc = document.getElementById("room-ipc").value;
  var freetime = document.getElementById("free-ipc").value;

  var orientation;
  if (sit == "on") {
    orientation = "sit";
  } else if (standing == "on") {
    orientation = "stand";
  }

  const userjson = {
    name: name,
    gender: gender,
    orientation: orientation,
    roomspc: roomspc,
    freetime: freetime
  };

  UserReg(userjson)
    .then(val => {
      console.log(val);
      form.style.display = "none";
      localStorage.setItem("isfirst", true);
      document.getElementById("dashboard-wrap").style.display = "block";
    })
    .catch(err => {
      console.log(err);
    });
});
