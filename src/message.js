const fs = require('fs');
const path = require('path');
const { postApiAudio } = require("./api/apiAudio")
const { postApiText } = require("./api/apiChat")

const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
    return true;
}

const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File ${filePath} deleted successfully.`);
        } else {
            console.log(`File ${filePath} not found.`);
        }
    } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
    }
}

async function textReplyingText(client, message) {

    const loadingMessageTimer = setTimeout(() => {
        client.sendText(message.from, "Trabalhando nisso, aguarde só mais um pouquinho...")
            .then((result) => {
                // console.log('Result: ', result)
            })
            .catch(err => console.log('Error sending: ', err))
        }, 10000);

    const data = await postApiText(message.body)
    client.sendText(message.from, data.choices[0].message.content)
        .then((result) => {
                console.log('Result: ', result)
            })
        .catch(err => console.log('Error sending: ', err))
        .finally(clearTimeout(loadingMessageTimer))
}

async function textReplyingAudio (client, message) {
    try {
        const audioPath = path.join(__dirname, 'assets', 'audios', `${message.id}.ogg`)
        const decryptedBuffer = await client.decryptFile(message)
        ensureDirectoryExistence(audioPath)
        fs.writeFileSync(audioPath, decryptedBuffer)

        const loadingMessageTimer = setTimeout(() => {
            client.sendText(message.from, "Trabalhando nisso, aguarde só mais um pouquinho...")
                .then((result) => {
                    // console.log('Result: ', result)
                })
                .catch(err => console.log('Error sending: ', err))
            }, 10000);

        const transcribedText = await postApiAudio(audioPath)
        console.log(transcribedText)
        const data = await postApiText(transcribedText.text)

        client.sendText(message.from, data.choices[0].message.content)
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