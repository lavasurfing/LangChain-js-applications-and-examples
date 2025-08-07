import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { CharacterTextSplitter } from 'langchain/text_splitter';
const code = `function helloWorld() {
                console.log("Hello, World!");
                }
                // Call the function
                helloWorld();`;


const recursive_splitter = async () => {
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("js",{
        chunkSize: 32,
        chunkOverlap: 0,
    })


await splitter.splitText(code).then((text) => console.log(text))
    
}

const charSplitter = async () => {
    const splitter = new CharacterTextSplitter({
        chunkSize: 32,
        chunkOverlap: 0,
        separator: " "
    })

    await splitter.splitText(code).then((text) => console.log(text))
}

// run
// recursive_splitter()
charSplitter()