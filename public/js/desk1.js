const createCaseForm = document.getElementById("new-case");

createCaseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let patientName = document.querySelector("#new-case .pName");
  let severity = document.querySelector("#new-case .svty");

  fetch("/api/case/newcase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientName: patientName.value,
      severity: Number(severity.value),
    }),
  }).then((response) => {
    patientName.value = "";
    severity.value = "";
  });
});
