#Deeplearing LLM Apps with LangChain js: 

## Baisc

### Prompt Template :  
- construct the  format and formatMessages

- 

### LangChain Expression Language ( LCEL )
- It is language composable language to chaining langchains modules together
- Object compatibles with LCEL is called runables


### Output parser
- parse output to 
- with the help of this we can parse the output into string format

### Using runables sequence 
- here we can make use of all the varibles for prompt , model and output parser
- and just by passing it across {product} data template 

### Streaming
- Stream chunks of data like video streaming via AI api , 
- 

### Batch
 - many diffrent inputs in array of objects are passed to model and output is recived at once


## Data loading and extraction 

### Loading principle
- from various sources > splitters > chunkc > vector data base
- Data is loaded from soruces then split using splitter , 
    then pushed into vector data base for understandable format for the AI model

### Git hub loader 
- package import import { GithubRepoLoader } from "langchain/document_loaders/web/github";
    This is used to load code and files from the github repos

- import * as parse from "pdf-parse";
    import { PDFLoader } from "langchain/document_loaders/fs/pdf" : This function allow us to load pdfs

### splitter
- using import { RecursiveCharacterTextSplitter } from "langchain/text_splitter" ,

- const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
    chunkSize: 32,  :: Max chunk size
    chunkOverlap: 0, : Overlapping of chunks 
    });

    This will help us to split textual data into chunks 

- text charater splitter : it's very basic types of splitter which split text based on separator symbol 

        import { CharacterTextSplitter } from "langchain/text_splitter";

        const splitter = new CharacterTextSplitter({
        chunkSize: 32,
        chunkOverlap: 0,
        separator: " "
        });

        await splitter.splitText(code);










