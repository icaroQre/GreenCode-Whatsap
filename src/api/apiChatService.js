require('dotenv').config();
const axios = require('axios');
const apiKey = process.env.OPENAI_API_KEY;

const apiChat = axios.create({
    baseURL: 'https://api.openai.com/v1/chat/completions',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    }
});

// Enviar uma mensagem à API do chat
const postApiChat = async (message) => {
    try {
        const response = await apiChat.post('', {
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        });
        console.log(response.data.choices[0].message.content);
        return response.data;
    } catch (error) {
        console.error(`Erro encontrado na requisição à ${apiChat.defaults.baseURL}`, error.message, error.response?.data);
        throw error;
    }
};

module.exports = {
    postApiChat
};
