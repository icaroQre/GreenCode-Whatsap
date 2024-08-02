const setLoadingMessageTimeout = (client, message) => {
    const timer = setTimeout(() => {
        client.sendText(message.from, "Trabalhando nisso, aguarde só mais um pouquinho...")
            .then((result) => {
                // console.log('Result: ', result)
            })
            .catch(err => console.log('Error sending: ', err));
    }, 10000);

    return timer;
};

module.exports = {
    setLoadingMessageTimeout
};
