const { getBotResponse } = require('../services/chatbotService');

exports.chatWithBot = async (req, res, next) => {
  const { message } = req.body;
  try {
    const botReply = await getBotResponse(message);
    res.json({ reply: botReply });
  } catch (err) {
    next(err);
  }
};
