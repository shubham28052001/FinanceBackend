const OpenAI = require("openai");

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
});

exports.financeChat = async (req,res)=>{
 try{

 const { message } = req.body;

 const response = await openai.chat.completions.create({
  model:"gpt-3.5-turbo",
  messages:[
   {
    role:"system",
    content:"You are a personal finance advisor chatbot."
   },
   {
    role:"user",
    content:message
   }
  ],
   max_tokens:100
 });

 res.json({
  success:true,
  reply:response.choices[0].message.content
 });

 }catch(error){
  res.status(500).json({
   success:false,
   message:error.message
  })
 }
}