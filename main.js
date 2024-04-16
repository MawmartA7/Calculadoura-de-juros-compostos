import generateReturnsArrey from "./src/investmentGoals";
import { Chart, plugins } from "chart.js/auto";
import createTable from "./src/table";

const asideElement = document.querySelector("aside");
const mainElement = document.querySelector("main");
const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const clearFormButton = document.getElementById("clear-form");
const form = document.querySelector("form");
let doughnutChartReference = {};
let progressionChartReference = {};

function formatCurrencyBRL(value) {
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
    format: (numberInfo) => formatCurrencyBRL(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrencyBRL(numberInfo),
  },
  {
    columnLabel: "Rendimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyBRL(numberInfo),
  },
  {
    columnLabel: "Quantia Total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyBRL(numberInfo),
  },
];

function formatCurrencyToChart(value) {
  return value.toFixed(2);
}

function expandMain() {
  asideElement.classList.add("hidden");
  asideElement.classList.remove("col-span-1");
  mainElement.classList.add("col-span-3");
  mainElement.classList.remove("col-span-2");
  expandButton.classList.add("hidden");
  compressButton.classList.remove("hidden");
}

function compressMain() {
  asideElement.classList.remove("hidden");
  asideElement.classList.add("col-span-1");
  mainElement.classList.remove("col-span-3");
  mainElement.classList.add("col-span-2");
  compressButton.classList.add("hidden");
  expandButton.classList.remove("hidden");
}

function renderProgression() {
  resetCharts();
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

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
  nextButton.classList.remove("hidden");
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
  document.getElementById("starting-amount").value = "";
  document.getElementById("additional-contribution").value = "";
  document.getElementById("time-amount").value = "";
  document.getElementById("time-amount-period").value = "monthly";
  document.getElementById("return-rate").value = "";
  document.getElementById("evaluation-period").value = "monthly";
  document.getElementById("tax-rate").value = "";
  nextButton.classList.add("hidden");
  previousButton.classList.add("hidden");
  Array.from(document.getElementById("results-table").children).forEach(
    (elementOfTable) => elementOfTable.remove()
  );
  carouselElement.scrollLeft -= mainElement.clientWidth;
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

function changeMode(mode) {
  if (mode === "white") {
    document.querySelector("body").classList.remove("dark");
    whiteModeButton.classList.add("hidden");
    darkModeButton.classList.remove("hidden");
  } else {
    document.querySelector("body").classList.add("dark");
    whiteModeButton.classList.remove("hidden");
    darkModeButton.classList.add("hidden");
  }
  localStorage.setItem("mode", mode);
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}
const carouselElement = document.getElementById("carousel");
const previousButton = document.getElementById("slide-arrow-previous");
const nextButton = document.getElementById("slide-arrow-next");
const expandButton = document.getElementById("expand-main");
const compressButton = document.getElementById("compress-main");
const darkModeButton = document.getElementById("dark-mode-button");
const whiteModeButton = document.getElementById("white-mode-button");
const beforeMode = localStorage.getItem("mode") ?? "white";

changeMode(beforeMode);

previousButton.addEventListener("click", () => {
  carouselElement.scrollLeft -= mainElement.clientWidth;
  nextButton.classList.remove("hidden");
  previousButton.classList.add("hidden");
});

nextButton.addEventListener("click", () => {
  carouselElement.scrollLeft += mainElement.clientWidth;
  previousButton.classList.remove("hidden");
  nextButton.classList.add("hidden");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  renderProgression();
});

whiteModeButton.addEventListener("click", () => changeMode("white"));
darkModeButton.addEventListener("click", () => changeMode("dark"));

clearFormButton.addEventListener("click", clearForm);

expandButton.addEventListener("click", expandMain);
compressButton.addEventListener("click", compressMain);
