const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.financeChat = async (req, res) => {
  try {

    const { message } = req.body;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `You are a personal finance advisor chatbot. Answer this: ${message}`,
      max_output_tokens: 100
    });

    res.json({
      success: true,
      reply: response.output[0].content[0].text
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};