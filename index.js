const core = require('@actions/core');
const json2md = require("json2md");
const { runEvaluator } = require('./evaluator');

const positiveIcon = ':white_check_mark:';
const negativeIcon = ':x:';
const titleByKeys = {
  performance: "Desempenho",
  totalPercentage: "Percentual de cumprimento de requisitos"
}

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

  const averageTableRows = Object.keys(data.evaluationByPercentage).map(key => {
    const row = [];
    row.push(titleByKeys[key]);
    row.push(`${data.evaluationByPercentage[key]}${key === titleByKeys.totalPercentage ? '%' : ''}`);
    return row;
  });
  
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