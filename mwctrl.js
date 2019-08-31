let isfirst = localStorage.getItem("isfirst", true);
if (!isfirst) {
  document.getElementById("dashboard-wrap").style.display = "none";
}

let submitbtn = document.getElementById("submit-btn");
let form = document.getElementById("form-wrap");

submitbtn.addEventListener("click", e => {
  form.style.display = "none";
  document.getElementById("dashboard-wrap").style.display = "block";
});
