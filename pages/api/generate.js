import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const name = req.body.name || '';
  const company = req.body.company || '';
  const occasion = req.body.occasion || '';
  const number = req.body.number || '';
  const role = req.body.role || '';
  const traitOne = req.body.traitOne || '';
  const traitTwo = req.body.traitTwo || '';
  const like = req.body.like || '';
  const temperature = (req.body.temperature/10) || 0.8;

  if (name.trim().length === 0 ) {
    res.status(400).json({
      error: {
        message: "Please enter a valid name",
      }
    });
    return;
  }

  if (occasion.length===0 ) {
    res.status(400).json({
      error: {
        message: "Please enter a valid occasion",
      }
    });
    return;
  }

  if (number<0 ) {
    res.status(400).json({
      error: {
        message: "Please enter a valid year",
      }
    });
    return;
  }

  if (traitOne=="" || traitTwo=="" ) {
    res.status(400).json({
      error: {
        message: "Please enter valid traitss",
      }
    });
    return;
  }



  try {
    console.log(temperature)
    // console.log("before fetch",name,number,company,occasion,role,traitOne,traitTwo,like)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(name,company,occasion,role,number,traitOne,traitTwo,like),
      temperature: temperature,
      "max_tokens": 250,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(name,company,occasion,role,number,traitOne,traitTwo,like) {
  
  if(occasion=='birthday'){
 

  return `Please write a heartfelt and highly creative birthday wishes.
   
  Name of the person:${name}.
  Two positive adjectives to describe the person: ${traitOne} and  ${traitTwo}.
  The person loves to:${like}. 

  End with a positive message or wishes for the person.`;
}

  if(occasion=='work anniversary'){
    return `Please write  a very creative work anniversary message. Provide the following information:
    
    Name of the person:${name}.
    Role: ${role}.
    Number of years they have been working :${number}.
    Two positive adjectives to describe the person: ${traitOne} and  ${traitTwo}.
    Name of the company:${company}. 
    End with a positive message or wishes for the person.
    
   
    `;}

}
