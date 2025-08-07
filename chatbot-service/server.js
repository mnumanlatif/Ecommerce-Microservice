const app = require('./app');
const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`Chatbot Service running on port ${PORT}`);
});
