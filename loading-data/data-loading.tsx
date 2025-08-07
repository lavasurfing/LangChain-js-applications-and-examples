import 'dotenv/config';

//  Document is loaded from github links 
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
// Peer dependency, used to support .gitignore syntax
import ignore from "ignore";

// Will not include anything under "ignorePaths"

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from 'path';




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

const pdf_path = path.resolve(__dirname, '/Users/Ashish/Documents/Github_repos/langchain/langchain-js','gchat.pdf')

const loader = new PDFLoader(pdf_path);

const docs = await loader.load()

console.log(docs)

}




// run 
// webloaders()
pdfloader()
