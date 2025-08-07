const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

exports.getBotResponse = async (message) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('[chatbot] OpenAI Error:', error.message || error);
    return 'Sorry, I am unable to process your request at the moment.';
  }
};
