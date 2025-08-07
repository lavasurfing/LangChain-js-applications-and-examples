import 'dotenv/config';

//  Document is loaded from github links 
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
// Peer dependency, used to support .gitignore syntax
import ignore from "ignore";

// Will not include anything under "ignorePaths"

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";



const webloaders = async () => {

    const git_path = "https://github.com/lavasurfing/nextjs_portfolio"

    const loader = new GithubRepoLoader(
        git_path,
        { recursive: false, ignorePaths: ["*.md", "yarn.lock"] }
    );

    const docs = await loader.load();

    console.log(docs[0]);


}

const pdfloader = async () => {

    
const nike10kPdfPath = '';

const loader = new PDFLoader(nike10kPdfPath);

const docs = await loader.load()

console.log(docs.splice(0, 3))

}




// run 
// webloaders()
// pdfloader()
