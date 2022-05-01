/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 366:
/***/ ((module) => {

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


/***/ }),

/***/ 378:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 537:
/***/ ((module) => {

module.exports = eval("require")("json2md");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(378);
const json2md = __nccwpck_require__(537);
const { runEvaluator } = __nccwpck_require__(366);

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
})();

module.exports = __webpack_exports__;
/******/ })()
;