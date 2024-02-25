// Function to handle case actions
function handleCase() {
  document
    .querySelectorAll("#phy-desk .case-div .case-actions .proceed-case")
    .forEach((item) => {
      item.addEventListener("click", async (e) => {
        let caseId = e.target.closest(".case-div").dataset.cid;
        try {
          let transferResponse = await fetch("/api/case/transfercase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dept1: "Physician",
              dept2: 0,
              caseId,
            }),
          });

          const res2 = await transferResponse.json();

          if (res2.status) {
            e.target.closest(".case-div").remove();
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
}

handleCase();

// Get next case from department queue
document
  .querySelector("#phy-desk .sect-head .next-case")
  .addEventListener("click", (e) => {
    let caseDiv = e.target.closest("#phy-desk").querySelector(".case-section");

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

// Change severity
document
  .querySelectorAll("#phy-desk .case-div .svr-vital .submit-svr")
  .forEach((item) => {
    item.addEventListener("click", async (e) => {
      let severity = e.target
        .closest(".severity-info")
        .querySelector(".svr-input").value;

      let caseId = e.target.closest(".case-div").dataset.cid;

      fetch("/api/case/setseverity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          severity,
          caseId,
        }),
      });
    });
  });

// Add Diagnosis
document
  .querySelectorAll("#phy-desk .case-div .diagnosis-info .submit-diag")
  .forEach((item) => {
    item.addEventListener("click", async (e) => {
      let staffId = e.target.closest(".case-section").dataset.staff;
      let caseId = e.target.closest(".case-div").dataset.cid;
      let body = e.target
        .closest(".diagnosis-info")
        .querySelector(".add-diagnosis").value;

      let response = await fetch("/api/case/adddiagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId,
          caseId,
          body: body ? body : "",
        }),
      });

      let res1 = await response.json();

      if (res1.status) {
        window.location.reload();
      }
    });
  });

// Search for Procedures
document
  .querySelectorAll("#phy-desk .case-div .tplan-info .input-prod")
  .forEach((item) => {
    item.addEventListener("input", async (e) => {
      let displayBox = e.target
        .closest(".add-tplan")
        .querySelector(".add-prodname");

      let response = await fetch(`/api/prod/get?x=${e.target.value}`);

      response = await response.json();

      if (response.status) {
        displayBox.textContent = response.message[0];
        displayBox.dataset.pid = response.message[1];
      } else {
        displayBox.textContent = "";
        displayBox.dataset.pid = "";
      }
    });
  });

// Add Treatment Plan
document
  .querySelectorAll("#phy-desk .case-div .tplan-info .submit-tplan")
  .forEach((item) => {
    item.addEventListener("click", async (e) => {
      let caseId = e.target.closest(".case-div").dataset.cid;
      let prodId = e.target.closest(".add-tplan").querySelector(".add-prodname")
        .dataset.pid;
      let objective = e.target
        .closest(".add-tplan")
        .querySelector(".add-prodobj").value;

      if (prodId) {
        let response = await fetch("/api/case/addtreatment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prodId,
            caseId,
            objective: objective ? objective : "",
          }),
        });

        let res1 = await response.json();

        if (res1.status) {
          window.location.reload();
        }
      }
    });
  });
