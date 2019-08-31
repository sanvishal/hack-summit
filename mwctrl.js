let isfirst = localStorage.getItem("isfirst", true);

let submitbtn = document.getElementById("submit-btn");
let form = document.getElementById("form-wrap");

submitbtn.addEventListener("click", e => {
  form.style.display = "none";
});
