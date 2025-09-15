# Deeplearing LLM Apps with LangChain js

## Baisc



### Prompt Template
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


## RAG foundation

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

## Vector Store

### Vector storage : It is a specialized database which has NPL (Natural Language Search) capability   

    - Embeddings : Embeddings are numerical representations of data (like words, images, or audio) that capture the semantic meaning and relationships between them. These representations, often vectors, allow machine learning models to understand and process complex information in a way that mimics human understanding. 

                It convert text into vectors 

    - Many providers embeddings are avilable for the use 

#### Vector Ingestion  
    - Its is a way of converting extracted data like text/image/video into vectors which can used by our llm to generate response

    - using import { similarity } from 'ml-distance' : can compare two sentence if meaningful or not
        v1 = "apple" , v2 ="apple juice" w similarity.cosine(v1 ,v2)  =>  0.7 - 0.8 , this shows similarity between two vectors 

### PDF reader 
- Pdf reader read page and covert them into chunk 
- These chunks can move to vector store through emmbedding models

## Retrivers 
- vectors store can also be used in chaining or piping of inputs 
- vectors store can invoke the database for a query answered by llm





## Conversational model : Compliation of all above work

### Question and Answer : 

    file : ques-answer.tsx

    - Loading : Data loading from various source like web links , pdf or sql data. This feed into the langchain using { PDFloader }

    - Spliting: Splitting Data into chunks and feeding them into embedding models for embedding

    - Vector store : These chunks can now be stored in vector store using the vectore store package of the langchain js. This vector store can be act as retreiver or invoke an answer from it.

    - There can be custom string parser function as runnable

    - Runnables : Now make a runnnable which will accept all the function names from loading to splitting to prompt and output.

    - Runnables can have many runnable objects which can be run in sequence or mapping

## Conversational Question

### Problem : Whenever we as the llm to list points based on chat history it cannot do it beacuse it doesn't have any chat history

- The idea is to use an history variable and the use of repeated prompt with question asked by the user

## Shipping as Web API
