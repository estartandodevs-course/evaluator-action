const core = require('@actions/core');
const json2md = require("json2md");
const { runEvaluator } = require('./evaluator');

const positiveIcon = ':white_check_mark:';
const negativeIcon = ':x:';

try {
  const testResultsInput = core.getInput('testResults');
  const { testResults } = JSON.parse(testResultsInput)
  const data = runEvaluator(testResults)
  const rows = data.evaluations.map(value => {
    const row = [];
    row.push(value.description);
    row.push(value.grade);
    row.push(value.grade === 1 ? positiveIcon : negativeIcon);
    return row;
  })

  const averageTableRows = [
    ["Desempenho", data.evaluationByPercentage.performance]
    ["Percentual de cumprimento de requisitos ", data.evaluationByPercentage.totalPercentage]
  ]
  
  const report = json2md([
    { h1: "Resultado" },
    { table: {
      headers: ["Descrição", "nota", ""],
      rows
    }},
    { h2: "Desempenho" },
    { table: {
      headers: ["Item", ""],
      rows: averageTableRows
    }}
  ])
  core.setOutput("report", report);
} catch (error) {
  core.setFailed(error.message);
}