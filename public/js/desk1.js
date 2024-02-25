const createCaseForm = document.getElementById("new-case");

createCaseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let patientName = document.querySelector("#new-case .pName");

  fetch("/api/case/newcase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientName: patientName.value,
      severity: 1,
    }),
  }).then((response) => {
    patientName.value = "";
  });
});

// Physician review
document
  .querySelectorAll("#fd-cases .case-section .case-div .rev-case")
  .forEach((node) => {
    node.addEventListener("click", async (e) => {
      let caseId = e.target.closest(".case-div").dataset.cid;

      let response = await fetch("/api/case/transfercase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept1: "FrontDesk",
          dept2: "Physician",
          caseId,
        }),
      });

      response = await response.json();

      if (response.status) {
        window.location.reload();
      }
    });
  });

// Recall case
document
  .querySelectorAll("#fd-cases .case-section .case-div .recall")
  .forEach((node) => {
    node.addEventListener("click", async (e) => {
      let caseId = e.target.closest(".case-div").dataset.cid;
      let deptName = e.target.closest(".case-section").dataset.dept;

      let response = await fetch("/api/case/recall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId,
          deptName,
        }),
      });

      response = await response.json();

      if (response.status) {
        window.location.reload();
      }
    });
  });

// Get next case from department queue
document
  .querySelector("#fd-cases .next-case")
  .addEventListener("click", (e) => {
    let caseDiv = e.target.closest("#fd-cases").querySelector(".case-section");

    const dptName = caseDiv.dataset.dept;

    fetch("/api/dept/nextcase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dptName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == true) {
          window.location.reload();
        }
      });
  });
