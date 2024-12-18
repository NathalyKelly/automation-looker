const axios = require("axios");
const fs = require("fs"); // Para manipulação de arquivos

// Função para obter dados da planilha
async function getSheetData(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  try {
    const response = await axios.get(url);
    const csv = response.data;

    // Converter CSV para JSON
    const rows = csv.split("\n").slice(1); // Pula a primeira linha (cabeçalho)
    const data = rows.map((row) => {
      const [Nome, DataNascimento, CPF] = row.split(",");
      return { Nome, DataNascimento, CPF };
    });

    return data;
  } catch (error) {
    console.error("Erro ao acessar a planilha:", error);
    return [];
  }
}

// Função para gerar um arquivo CSV com resultados
function createCsvFile(resultados) {
  let csvContent = "CPF,Encontrado\n";

  resultados.forEach((linha) => {
    csvContent += `${linha.CPF},${linha.Encontrado}\n`;
  });

  // Salva o arquivo CSV localmente
  const caminhoArquivo = "resultados_validacao.csv";
  fs.writeFileSync(caminhoArquivo, csvContent, "utf8");

  
  console.log("Arquivo de resultados criado com sucesso!");
}

module.exports = { getSheetData, createCsvFile };
