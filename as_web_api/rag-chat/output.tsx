import { HttpResponseOutputParser } from "langchain/output_parsers";

export const httpResponseOutputParser = new HttpResponseOutputParser({
  contentType: "text/plain",
});


