// Search for case
document
  .querySelector("#rev-case .lookup-form .search-cid")
  .addEventListener("click", async (e) => {
    let caseId = document.querySelector(
      "#rev-case .lookup-form .input-cid"
    ).value;

    if (caseId) {
      window.location.href = `/dashboard?path=revCase&cid=${caseId}`;
    }
  });

// Close case box
document
  .querySelector(".case-div .case-actions .close-case")
  .addEventListener("click", (e) => {
    e.target.closest(".case-div").remove();
  });

// Submit severity
document
  .querySelector(".case-div .svr-vital .submit-svr")
  ?.addEventListener("click", async (e) => {
    let severity = e.target
      .closest(".severity-info")
      .querySelector(".svr-input").value;

    let caseId = e.target.closest(".case-div").dataset.cid;

    let response = await fetch("/api/case/setseverity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        severity,
        caseId,
      }),
    });

    let res1 = await response.json();

    if (res1.status) {
      window.location.reload();
    }
  });

// Set Vital Signs
document
  .querySelector(".case-div .vitals-info .set-vital")
  ?.addEventListener("click", async (e) => {
    let temperature =
      e.target.closest(".vitals-info").querySelector(".temp-input").value ||
      "0";
    let bloodPressure =
      e.target.closest(".vitals-info").querySelector(".bp-input").value || "0";
    let caseId = e.target.closest(".case-div").dataset.cid;

    const response = await fetch("/api/case/addVitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temperature,
        bloodPressure,
        severity: "",
        caseId,
      }),
    });

    let res1 = await response.json();

    if (res1.status) {
      window.location.reload();
    }
  });

// Add diagnosis
document
  .querySelector(".case-div .diagnosis-info .submit-diag")
  ?.addEventListener("click", async (e) => {
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

// Search for procedure
document
  .querySelector(".case-div .tplan-info .input-prod")
  ?.addEventListener("input", async (e) => {
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

// Add treatment plan
document
  .querySelector(".case-div .tplan-info .submit-tplan")
  ?.addEventListener("click", async (e) => {
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

// Discharge Patient
document
  .querySelector(".case-div .case-actions .discharge")
  ?.addEventListener("click", async (e) => {
    let caseId = e.target.closest(".case-div").dataset.cid;

    let response = await fetch("/api/case/discharge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId,
      }),
    });

    let res1 = await response.json();

    if (res1.status) {
      window.location.reload();
    }
  });

// Add documentation
document
  .querySelectorAll(".case-div .tplan-items .add-doc .prod-close")
  .forEach((node) => {
    node?.addEventListener("click", async (e) => {
      let text = e.target.closest(".add-doc").querySelector("textarea").value;
      let prodId = e.target.closest(".tplan-item").dataset.pid;
      let caseId = e.target.closest(".case-div").dataset.cid;

      console.log(text, prodId, caseId);
      let response = await fetch("/api/case/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text ? text : "",
          prodId,
          caseId,
        }),
      });

      response = await response.json();

      if (response.status) {
        window.location.reload();
      }
    });
  });

// Activate scheduled cases
document
  .querySelectorAll(".case-div .tplan-items .prod-actions .prod-sched")
  .forEach((node) => {
    node?.addEventListener("click", async (e) => {
      let prodId = e.target.closest(".tplan-item").dataset.pid;
      let caseId = e.target.closest(".case-div").dataset.cid;

      let response = await fetch("/api/case/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: Date.now() + 86400000,
          prodId,
          caseId,
        }),
      });

      response = await response.json();

      if (response.status) {
        window.location.reload();
      }
    });
  });

// Reroute cases
document
  .querySelector(".case-div .case-actions .re-act")
  ?.addEventListener("click", async (e) => {
    let caseId = e.target.closest(".case-div").dataset.cid;

    let response = await fetch("/api/case/reactivate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId,
      }),
    });

    response = await response.json();

    if (response.status) {
      window.location.reload();
    }
  });
