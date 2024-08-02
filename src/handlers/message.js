const fs = require('fs');
const path = require('path');
const { postApiAudio } = require("../api/api-audio")
const { ensureDirectoryExistence, deleteFile } = require('./file');
const { runThread } = require('../api/assistant');
const { setLoadingMessageTimeout } = require('../utils/timeout-utils');

async function textReplyingText(client, message) {
    const loadingMessageTimer = setLoadingMessageTimeout(client, message, 10000)

    const data = await runThread(message.from, message.body)
    client.sendText(message.from, data)
        .then((result) => {
                console.log('Result: ', result)
            })
        .catch(err => console.log('Error sending: ', err))
        .finally(() => clearTimeout(loadingMessageTimer))
}

async function textReplyingAudio (client, message) {
    try {
        const audioPath = path.join(__dirname, 'assets', 'audios', `${message.id}.ogg`)
        const decryptedBuffer = await client.decryptFile(message)
        ensureDirectoryExistence(audioPath)
        fs.writeFileSync(audioPath, decryptedBuffer)

        const loadingMessageTimer = setLoadingMessageTimeout(client, message, 10000)

        const transcribedText = await postApiAudio(audioPath)
        console.log("texto transcrito" + transcribedText.text)
        const data = await runThread(message.from, transcribedText.text)

        client.sendText(message.from, data)
            .then((result) => {
                console.log('Result: ', result)
            })
            .catch(err => console.log('Error sending: ', err))
            .finally(() => {
                clearTimeout(loadingMessageTimer)
                deleteFile(audioPath)
            })

      } catch (error) {
        console.error(`Erro ao processar o áudio: ${error.message}`);
      }
}

module.exports = {
    textReplyingText,
    textReplyingAudio
}