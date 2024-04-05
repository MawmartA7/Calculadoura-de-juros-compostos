function convertToMontlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export default function generateReturnsArrey(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = "monthly",
  mounthlyContribution = 0,
  returnRate = 0,
  returnRatePeriod = "monthly"
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      "Investimento inicial e prazo devem ser preenchidos com valores positivos."
    );
  }
  const finalyReturnRatePeriod =
    returnRatePeriod === "monthly"
      ? 1 + returnRate / 100
      : convertToMontlyReturnRate(1 + returnRate / 100);

  const finalTimeHorizon =
    timePeriod === "monthly" ? timeHorizon : timeHorizon * 12;

  const referenceInvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };

  const returnsArrey = [referenceInvestmentObject];
  for (
    let timeReference = 1;
    timeReference <= finalTimeHorizon;
    timeReference++
  ) {
    const totalAmount =
      returnsArrey[timeReference - 1].totalAmount * finalyReturnRatePeriod +
      mounthlyContribution;
    const interestReturns = totalAmount - mounthlyContribution;
    const investedAmount =
      startingAmount + mounthlyContribution * timeReference;
    const totalInterestReturns = totalAmount - investedAmount;
    returnsArrey.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }

  return returnsArrey;
}
