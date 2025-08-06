// system and human message formatting for LangChain.js
import { ChatPromptTemplate } from "@langchain/core/prompts";
import 'dotenv/config';
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";

// here we are separately formatting system and human message for the ai model
// system message : It's the message that defines tasks what answer to give on which context
// human message : It's message for the local model and AI 

async function systemHumanMsg(){
const promptFromMessages = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate("You are great in picking company names"),
    HumanMessagePromptTemplate.fromTemplate("What would be a good company name for a company that makes {product}?"),   
]);

// await promptFromMessages.format({ product: "colorful socks" })
//     .then((formatted) => console.log(formatted))

await promptFromMessages.formatMessages({
    product : "colorful socks"
}).then((fomatted) => console.log(fomatted))

}

// short hand method for the above template
async function shortHand_template() {
    const promotMessage = ChatPromptTemplate.fromMessages([
        ["system", "You're an expert in picking names"],
        ["human", `What are three best names of {product} making company `]
    ])

    await promotMessage.formatMessages({
        product: "woolen socks"
    }).then((message) => console.log(message))
}

// systemHumanMsg()

shortHand_template()





