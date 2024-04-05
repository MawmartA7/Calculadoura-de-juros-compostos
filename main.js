import generateReturnsArrey from "./src/investmentGoals";

const clearFormButton = document.getElementById("clear-form");

const form = document.querySelector("form");
function renderProgression() {
  const startingAmount = Number(
    form["form-elements"][0].value.replace(",", ".")
  );
  const additionalContribution = Number(
    form["form-elements"][1].value.replace(",", ".")
  );
  const timeAmount = Number(form["form-elements"][2].value);
  const timeAmountPeriod = form["form-elements"][3].value;
  const returnRate = Number(form["form-elements"][4].value.replace(",", "."));
  const returnRatePeriod = form["form-elements"][5].value;
  const taxRate = Number(form["form-elements"][6].value.replace(",", "."));

  const returnsArrey = generateReturnsArrey(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );
  console.log(returnsArrey);
}

function clearForm() {
  form["form-elements"][0].value = "";
  form["form-elements"][1].value = "";
  form["form-elements"][2].value = "";
  form["form-elements"][3].value = "monthly";
  form["form-elements"][4].value = "";
  form["form-elements"][5].value = "monthly";
  form["form-elements"][6].value = "";

  const errorInputsContainers = document.querySelectorAll(".error");
  for (const errorInputsContainer of errorInputsContainers) {
    errorInputsContainer.classList.remove("error");
    errorInputsContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(event) {
  const inputValue = event.target.value.replace(",", ".");
  const { parentElement } = event.target;
  const grandParentElement = event.target.parentElement.parentElement;
  if (inputValue === "") {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
    return;
  }
  if (
    !parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    return;
  }
  if (isNaN(inputValue) || Number(inputValue) <= 0) {
    if (!parentElement.classList.contains("error")) {
      const errorTextElement = document.createElement("p");
      errorTextElement.classList.add("text-red-500");
      errorTextElement.innerText =
        "Insira um valor numérico e maior do que zero";
      parentElement.classList.add("error");
      grandParentElement.appendChild(errorTextElement);
    }
  } else if (
    (parentElement.classList.contains("error") && !isNaN(inputValue)) ||
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  renderProgression();
});

clearFormButton.addEventListener("click", clearForm);
