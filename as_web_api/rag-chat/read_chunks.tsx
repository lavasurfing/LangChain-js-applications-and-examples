import { TextDecoder } from "util";

// readChunks() read from the provided reader and yields each chunk into async iterable
const decoder = new TextDecoder();

export function readChunks(reader: ReadableStreamDefaultReader) {
  return {
    async *[Symbol.asyncIterator]() {
        let readResult = await reader.read(); 
        while (!readResult.done) {
            yield decoder.decode(readResult.value);
            readResult = await reader.read();   
        }

    }
  };
}

// to pause continous execution for 1 second
export const sleep = async () => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}
