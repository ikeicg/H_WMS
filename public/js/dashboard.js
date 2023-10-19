const logoutBtn = document.getElementById("logout_btn");

logoutBtn.addEventListener("click", () => {
  fetch("/logout", {
    method: "GET",
    credentials: "same-origin",
  })
    .then((response) => response.json())
    .then((data) => {
      window.location.href = data.redirect;
    });
});
