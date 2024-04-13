import generateReturnsArrey from "./src/investmentGoals";
import { Chart } from "chart.js/auto";
import createTable from "./src/table";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const clearFormButton = document.getElementById("clear-form");
const form = document.querySelector("form");
let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const colomnsArrey = [
  {
    columnLabel: "Mês",
    accessor: "month",
  },
  {
    columnLabel: "Total Investido",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Quantia Total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToChart(value) {
  return value.toFixed(2);
}

function renderProgression() {
  resetCharts();
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

  const finalInvestmentObject = returnsArrey[returnsArrey.length - 1];
  if (taxRate === "" || taxRate <= 0) {
    doughnutChartReference = new Chart(finalMoneyChart, {
      type: "doughnut",
      data: {
        labels: ["Total investido", "Total de rendimento"],
        datasets: [
          {
            data: [
              formatCurrencyToChart(finalInvestmentObject.investedAmount),
              formatCurrencyToChart(finalInvestmentObject.totalInterestReturns),
            ],
            backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
            hoverOffset: 4,
          },
        ],
      },
    });
  } else {
    doughnutChartReference = new Chart(finalMoneyChart, {
      type: "doughnut",
      data: {
        labels: ["Total investido", "Total de rendimento", "Imposto"],
        datasets: [
          {
            data: [
              formatCurrencyToChart(finalInvestmentObject.investedAmount),
              formatCurrencyToChart(
                finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
              ),
              formatCurrencyToChart(
                finalInvestmentObject.totalInterestReturns * (taxRate / 100)
              ),
            ],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  }
  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArrey.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total investido",
          data: returnsArrey.map((investmentObject) =>
            formatCurrencyToChart(investmentObject.investedAmount)
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do investimento",
          data: returnsArrey.map((investmentObject) =>
            formatCurrencyToChart(investmentObject.interestReturns)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  createTable(colomnsArrey, returnsArrey, "results-table");
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["form-elements"][0].value = "";
  form["form-elements"][1].value = "";
  form["form-elements"][2].value = "";
  form["form-elements"][3].value = "monthly";
  form["form-elements"][4].value = "";
  form["form-elements"][5].value = "monthly";
  form["form-elements"][6].value = "";
  resetCharts();

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
const mainElement = document.querySelector("main");
const carouselElement = document.getElementById("carousel");
const previousButton = document.getElementById("slide-arrow-previous");
const nextButton = document.getElementById("slide-arrow-next");

previousButton.addEventListener("click", () => {
  carouselElement.scrollLeft -= mainElement.clientWidth;
});

nextButton.addEventListener("click", () => {
  carouselElement.scrollLeft += mainElement.clientWidth;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  renderProgression();
});

clearFormButton.addEventListener("click", clearForm);
