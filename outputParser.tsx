import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Keys from "./basic";

//  use of outparser is important for the creating output for the text-box or just displaying information
// Streaming : Chunk of data being passed via api , similar to video stream
// Batch : Batch input for the model

const outputParserFunc = async () => {

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        // model: "gemini-2.0-pro" : Google API key is required for this model
        apiKey: Keys(),
        maxOutputTokens: 2048,
    });

    
    const prompt = ChatPromptTemplate.fromMessages([`Suggest some company names for {product}`])
    
    // initalized output parser 
    const outputParser = new StringOutputParser();

    const nameGenerationChain = prompt.pipe(model).pipe(outputParser)


<<<<<<< HEAD
=======
    // -----------------------------------------------------------------------------------------------
>>>>>>> 96322d3 (node_modules ignore this time)

    // invoking using chaining and output parser

    // await nameGenerationChain.invoke({
    //     product: "colorful socks"
    // }).then((msg) => console.log(msg))

<<<<<<< HEAD
=======
    // -----------------------------------------------------------------------------------------------
>>>>>>> 96322d3 (node_modules ignore this time)


    // steaming

    // const stream = await nameGenerationChain.stream({
    //     product : "space exploration spacecraft"
    // })

    // for await (const chunk of stream) {
    //     console.log(chunk)
    // }

<<<<<<< HEAD
=======
    // -----------------------------------------------------------------------------------------------
>>>>>>> 96322d3 (node_modules ignore this time)


    // batching 

    const batch_input = [
        {product : "super computers"},
        {product : "raincoats"},
    ]

    await nameGenerationChain.batch(batch_input).then((res) => console.log(res))


}

outputParserFunc()