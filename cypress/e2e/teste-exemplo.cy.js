const { getSheetData } = require("../support/googleSheets");

describe("Verificar dados no Looker", () => {
  let dados;
  const sheetId = "16QJQqqAvPvu7UNrxRdb4VvEfHFtpV-nfUp9b0ibhu2Y"; // Substitua pelo ID da sua planilha

  before(() => {
    // Carrega os dados da planilha
    return getSheetData(sheetId).then((sheetData) => {
      dados = sheetData;
      cy.log("Dados carregados:", JSON.stringify(dados)); // Log para conferir os dados
      expect(dados).to.be.an("array").and.to.have.length.greaterThan(0); // Verifica se dados é uma array com itens
    });
  });

  it("Pesquisa dados no Looker", () => {
    // Cria um array para armazenar os resultados
    let resultados = [];

    cy.visit(
      "https://lookerstudio.google.com/reporting/9649e1cd-30c3-4a5b-8690-a1769811c238/page/QutXE"
    );

    // Aguarda 5 segundos para garantir que a página tenha tempo de carregar
    cy.wait(5000);

    // Fecha o possível diálogo inicial
    cy.get("md-dialog-actions > :nth-child(2)").click();
    cy.get("body").click(40, 20);

    // Laço para percorrer os dados da planilha
    cy.wrap(dados).each((item, index) => {
      // Remove aspas do CPF, se existirem
      const cpfSemAspas = item.CPF.replace(/"/g, "");

      // Digita o CPF no campo
      cy.get('input[placeholder="Insira um valor"]')
        .clear()
        .type(cpfSemAspas, { force: true });
      cy.get(".button > span").click();
      cy.wait(2000);

      cy.get("body").then(($body) => {
        // Verifica se o elemento ".noData" existe e se está visível
        const noDataElement = $body.find(".noData");

        let resultado;
        if (noDataElement.length > 0 && noDataElement.css("display") === "none") {
          cy.log(`CPF ${cpfSemAspas} encontrado na tela`);
          resultado = "Sim";
        } else {
          cy.log(
            `CPF ${cpfSemAspas} não encontrado, mensagem "Não há dados" encontrada`
          );
          resultado = "Não";
        }

        // Adiciona o CPF e o resultado à lista de resultados
        resultados.push({ CPF: cpfSemAspas, Encontrado: resultado });

        // Após o término da iteração de todos os CPFs, cria o arquivo
        if (index === dados.length - 1) {
          const csvContent =
            "CPF,Encontrado\n" +
            resultados
              .map((linha) => `${linha.CPF},${linha.Encontrado}`)
              .join("\n");
          cy.writeFile("resultados_validacao.csv", csvContent); // Gera o arquivo CSV
          cy.log("Arquivo de resultados criado com sucesso!");
        }
      });
    });
  });
});
