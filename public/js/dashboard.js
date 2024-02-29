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

document
  .querySelector("#main-content #dpt_div #open-dept")
  ?.addEventListener("click", async (e) => {
    deptName = e.target.closest("#dpt_div").dataset.dept;

    let response = await fetch("/api/dept/close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deptName,
      }),
    });

    response = await response.json();

    if (response.status) {
      window.location.reload();
    }
  });
