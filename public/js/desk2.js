// Function to handle case actions
function handleCase() {
  document.querySelectorAll(".new-vitals .add-vital").forEach((node) => {
    node.addEventListener("click", async (e) => {
      const newVitals = e.target.closest(".new-vitals");

      const temperature =
        newVitals.querySelector(".vital-signs .temp").value || "0";
      const bloodPressure =
        newVitals.querySelector(".vital-signs .bP").value || "0";
      const severity = newVitals.querySelector(".vital-signs .svrt").value || 1;
      const caseId = Number(newVitals.dataset.cid);

      try {
        const response = await fetch("/api/case/addVitals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            temperature,
            bloodPressure,
            severity,
            caseId,
          }),
        });

        const res2 = await response.json();

        if (res2.status) {
          const transferResponse = await fetch("/api/case/transfercase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dept1: "Triage",
              dept2: "Physician",
              caseId,
            }),
          });

          const res3 = await transferResponse.json();

          if (res3.status) {
            e.target.closest(".new-vitals").remove();
          }
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
  .querySelector("#tr-cases .next-case")
  .addEventListener("click", (e) => {
    let caseDiv = e.target.closest("#tr-cases").querySelector(".case-section");

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
