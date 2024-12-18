const fs = require('fs');
const path = require('path');

/**
 * Adiciona conteúdo ao arquivo.
 * Se o arquivo não existir, ele será criado.
 * @param {string} filePath - Caminho para o arquivo.
 * @param {string} content - Conteúdo a ser adicionado.
 */
function appendToFile(filePath, content) {
  const absolutePath = path.resolve(filePath);
  try {
    fs.appendFileSync(absolutePath, content, { encoding: 'utf-8' });
    console.log(`Conteúdo adicionado ao arquivo: ${absolutePath}`);
  } catch (err) {
    console.error(`Erro ao escrever no arquivo ${absolutePath}:`, err);
  }
}

/**
 * Limpa o conteúdo de um arquivo, ou cria o arquivo se ele não existir.
 * @param {string} filePath - Caminho para o arquivo.
 */
function clearFile(filePath) {
  const absolutePath = path.resolve(filePath);
  try {
    fs.writeFileSync(absolutePath, '', { encoding: 'utf-8' });
    console.log(`Arquivo limpo/criado: ${absolutePath}`);
  } catch (err) {
    console.error(`Erro ao limpar/criar o arquivo ${absolutePath}:`, err);
  }
}

module.exports = { appendToFile, clearFile };
