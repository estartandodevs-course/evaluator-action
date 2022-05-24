const CORRECT_ANSWER_GRADE = 1;
const WRONG_ANSWER_GRADE = 0;
const AVERAGE = 70
const INSUFFICIENT = 'insufficient'
const SUFFICIENT = 'sufficient'

function runEvaluator(testResults) {
  const evaluationsByRequirements = testResults
    .map(({ assertionResults }) =>
      assertionResults.map(({ ancestorTitles, title,  status }) => ({
        describe: title || ancestorTitles[ancestorTitles.length - 1],
        status,
      }))
    )
    .flat()
    .reduce((acc, evaluation) => {
      const status = acc[evaluation.describe];
      const currentStatus = evaluation.status;
      if (!status || currentStatus === "failed") {
        acc[evaluation.describe] = currentStatus;
        return acc;
      }
      return acc;
    }, {});

  const requirements = testResults
    .map(({ assertionResults }) =>
      assertionResults.map(({ ancestorTitles, title }) => ({
        description: title || ancestorTitles[ancestorTitles.length - 1],
      }))
    )
    .flat();

  const evaluations = requirements.map(({ description }) => ({
    description,
    grade:
      evaluationsByRequirements[description] === "passed"
        ? CORRECT_ANSWER_GRADE
        : WRONG_ANSWER_GRADE,
  }));

  const evaluationValueTotal = evaluations.reduce((total, current) => total + current.grade , 0);

  const totalPercentage = evaluationValueTotal / evaluations.length * 100

  const evaluationByPercentage =  {
    performance: totalPercentage >= AVERAGE ? SUFFICIENT : INSUFFICIENT,
    totalPercentage: totalPercentage.toFixed(2)
  }

  const evaluationResult = {
    evaluations,
    evaluationByPercentage
  };
  
  return evaluationResult;
}

module.exports = {
  runEvaluator
}
