# evaluator-action

Uma GitHub action para gerar uma tabela com uma avaliação de acordo com resultado dos testes.

Essa ação foi criada para ajudar a avaliar os trabalhos dos alunos.

## Como usar

>sugerimos usar em conjunto com [capture-test-result-action](https://github.com/estartandodevs-course/capture-test-result-action)

```yml
on:
  pull_request:
    branches: [main]

jobs:
  evaluator-job:
    runs-on: ubuntu-latest
    name: Evaluator JOB
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: "14.x"
      - name: Install dependencies
        run: npm install
      - name: Test
        run: npm rum test
      - name: Read result with capture-test-result-action
        id: resultOutput
        uses: estartandodevs-course/capture-test-result-action@v1.0.0
        with:
          resultPath: /tmp/result.json
      - name: Run evaluator
        id: evaluator
        uses: estartandodevs-course/evaluator-action@v1.0.2
        with:
          testResults: ${{ steps.resultOutput.outputs.resultOfOutputTests }}

```

## Usando valores capturados
>obs: O valor retornado é uma tabela em markdow.

```yml
      - name: Create comment with evaluation result
        uses: peter-evans/create-or-update-comment@v2
        with:
          token: ${{ secrets.GH_TOKEN }}
          issue-number: ${{ github.event.number }}
          body: ${{ steps.evaluator.outputs.report }}

```

### Valores de entrada

| Name | Description | Default |
| --- | --- | --- |
| `testResults` | Valor gerado na [exportação do jest](https://jestjs.io/pt-BR/docs/configuration#testresultsprocessor-string) parseado com `JSON.stringify` |  |


<img width="930" alt="image" src="https://user-images.githubusercontent.com/34426836/166235131-55af6143-63d3-438d-985c-827c2d44e973.png">

