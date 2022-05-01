const core = require('@actions/core');
const json2md = require("json2md");
const { runEvaluator } = require('./evaluator');

const positiveIcon = ':white_check_mark:';
const negativeIcon = ':x:';

try {
  const testResults = core.getInput('testResults');
  const data = runEvaluator(testResults)
  const rows = data.evaluations.map(value => {
    const row = [];
    row.push(value.description);
    row.push(value.grade);
    row.push(value.grade > 1 ? positiveIcon : negativeIcon);
    return row;
  })
  const report = json2md([
    { h1: "Resultado" },
    { table: {
      headers: ["Descrição", "nota", "-"],
      rows
    }}
  ])
  core.setOutput("report", report);
} catch (error) {
  core.setFailed(error.message);
}