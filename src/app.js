const { postApiChat } = require("./api/apiChatService")
const venom = require('venom-bot')

console.log("Inicando aplicação...")

const sessionName = "GreenCode"

venom.create({
    session: 'teste'
})
    .then((client) => { 
        start(client)
        console.log(`Sessão ${sessionName} crianda com sucesso!`)
     })
    .catch((err) => console.log(err))

function start(client) {
    
    client.onMessage(async (message) => {
        
        // TimeOut caso a requisição demore
        const loadingMessageTimer = setTimeout(() => {
            client.sendText(message.from, "Trabalhando nisso, aguarde só mais um pouquinho...")
                        .then((result) => {
                            // console.log('Result: ', result)
                        })
                        .catch(err => console.log('Error sending: ', err))
        }, 10000)

        const data = await postApiChat(message.body)
        clearTimeout(loadingMessageTimer)

        client.sendText(message.from, data.choices[0].message.content)
                .then((result) => {
                    // console.log('Result: ', result)
                })
                .catch(err => console.log('Error sending: ', err))
    })
}