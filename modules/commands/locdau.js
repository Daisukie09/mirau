const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "locdau",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Dgk",
  description: "Extract content from string by specified delimiter and save to file",
  commandCategory: "Admin",
  usages: "<inputFileName> <outputFilePath> <delimiter>",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const inputFileName = args[0];
  const outputFileName = args[1];
  const delimiter = args[2];

  if (!inputFileName || !outputFileName || !delimiter) {
    api.sendMessage('❎ Please enter correct format: <inputFileName> <outputFilePath> <delimiter>', threadID, messageID);
    return;
  }

  const inputFilePath = path.join(__dirname, '../../includes/datajson/', inputFileName);

  let inputFileContent;
  try {
    inputFileContent = fs.readFileSync(inputFilePath, 'utf8');
  } catch (error) {
    api.sendMessage(`⚠️ Error reading file: ${error.message}`, threadID, messageID);
    return;
  }

  // Create regex based on provided delimiter
  const regex = new RegExp(`\\${delimiter}([^\\${delimiter}]*)\\${delimiter}`, 'g');
  let match = regex.exec(inputFileContent);
  let outputContent = '';

  if (!match) {
    api.sendMessage(`No content found with delimiter "${delimiter}" in file ${inputFilePath}. Please check the content.`, threadID, messageID);
    return;
  }

  while (match !== null) {
    const content = match[1];

    if (content.length > 0) {
      outputContent += content + '\n';
    }

    match = regex.exec(inputFileContent);
  }

  fs.writeFileSync(outputFileName, outputContent.trim());
  api.sendMessage(`Extracted content by delimiter "${delimiter}" and saved to file ${outputFileName}.`, threadID, messageID);
};