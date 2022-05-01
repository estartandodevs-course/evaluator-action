const CORRECT_ANSWER_GRADE = 3;
const WRONG_ANSWER_GRADE = 1;

function runEvaluator(testResults) {
  const evaluationsByRequirements = testResults
    .map(({ assertionResults }) =>
      assertionResults.map(({ ancestorTitles, status }) => ({
        describe: ancestorTitles[ancestorTitles.length - 1],
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
      assertionResults.map(({ ancestorTitles }) => ({
        description: ancestorTitles[ancestorTitles.length - 1],
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

  const evaluationResult = {
    evaluations,
  };
  
  return evaluationResult;
}

module.exports = {
  runEvaluator
}
