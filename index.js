const core = require("@actions/core");
const json2md = require("json2md");
const { runEvaluator } = require("./evaluator");

const titleByKeys = {
  performance: "Média",
  totalPercentage: "Percentual de cumprimento de requisitos",
  sufficient: "Suficiente",
  insufficient: "Insuficiente"
};

const iconByKey = {
  positiveIcon: ":white_check_mark:",
  negativeIcon: ":x:",
  performance: "",
  totalPercentage: "%",
};

try {
  const testResultsInput = core.getInput("testResults");
  const { testResults } = JSON.parse(testResultsInput);
  const data = runEvaluator(testResults);
  const rows = data.evaluations.map((value, index) => {
    const row = [];
    row.push(`${index + 1}-${value.description}`);
    row.push(value.grade);
    row.push(
      value.grade === 1 ? iconByKey.positiveIcon : iconByKey.negativeIcon
    );
    return row;
  });

  const averageTableRows = Object.keys(data.evaluationByPercentage).map(
    (key) => {
      const row = [];
      row.push(titleByKeys[key]);
      row.push(`${titleByKeys[data.evaluationByPercentage[key]] || data.evaluationByPercentage[key]}${iconByKey[key]}`);
      return row;
    }
  );

  const report = json2md([
    { h1: "Resultado" },
    {
      table: {
        headers: ["Descrição", "nota", ""],
        rows,
      },
    },
    { h2: "Desempenho" },
    {
      table: {
        headers: ["Item", ""],
        rows: averageTableRows,
      },
    },
  ]);
  core.setOutput("report", report);
} catch (error) {
  core.setFailed(error.message);
}
