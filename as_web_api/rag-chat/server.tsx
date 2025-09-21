import "express";

// @ts-ignore
import require from "requirejs";
import handler from "./handler";

const express = require("express");
const app = express();
const port = 3000;

app.get("/",(req: any, res: any) => {
    res.send("<h1>Hello World! This is RAG chat API !</h1>");
})


app.listen(port, () => {
    console.log(`RAG chat API listening on http://localhost:${port}`);
});






