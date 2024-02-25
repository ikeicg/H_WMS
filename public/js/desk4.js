// Schedule Procedure
document
  .querySelectorAll(".case-div .prod-item .case-actions .sched-case")
  .forEach((node) => {
    node.addEventListener("click", async (e) => {
      let date = e.target
        .closest(".case-actions")
        .querySelector(".sched-date").value;
      let prodId = e.target.closest(".prod-item").dataset.pid;
      let caseId = e.target.closest(".case-div").dataset.cid;

      let response = await fetch("/api/case/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date ? Date.parse(date) : Date.now() + 86400000,
          prodId,
          caseId,
        }),
      });

      response = await response.json();

      if (response.status) {
        console.log(response);
        window.location.reload();
      }
    });
  });

// Close Procedure
document
  .querySelectorAll(".case-div .prod-item .case-actions .close-case")
  .forEach((node) => {
    node.addEventListener("click", async (e) => {
      let text = e.target
        .closest(".prod-item")
        .querySelector(".doc-case").value;
      let prodId = e.target.closest(".prod-item").dataset.pid;
      let staffId = e.target.closest(".case-section").dataset.staff;
      let caseId = e.target.closest(".case-div").dataset.cid;

      let response = await fetch("/api/case/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text ? text : "",
          prodId,
          caseId,
          staffId,
        }),
      });

      response = await response.json();

      if (response.status) {
        console.log(response);
        window.location.reload();
      }
    });
  });

// Get next case from department queue
document
  .querySelector("#gdpt-desk .next-case")
  .addEventListener("click", (e) => {
    let caseDiv = e.target.closest("#gdpt-desk").querySelector(".case-section");

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

// Proceed Case
document
  .querySelectorAll("#gdpt-desk .case-div .case-actions2 .proceed-case")
  .forEach((item) => {
    item.addEventListener("click", async (e) => {
      let caseId = e.target.closest(".case-div").dataset.cid;
      let dptName = e.target.closest(".case-section").dataset.dept;
      try {
        let transferResponse = await fetch("/api/case/transfercase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dept1: dptName,
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
