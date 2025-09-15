// Function to convert ASCII codes to characters
const asciiToText = (asciiString) => {
    return asciiString
        .split(',')
        .map(code => String.fromCharCode(parseInt(code.trim())))
        .join('');
};

const make_request = async () => {
    const port = 8090;

    try {
        const response = await fetch(`http://localhost:${port}/chat`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                question: "What are the prerequisites for machine learning?",
                sessionId: "1",
            })
        });
        
        const text = await response.text();
        console.log("RAW RESPONSE:", text);
        
        try {
            const data = JSON.parse(text);
            console.log("ANSWER:", data.answer);
        } catch (parseError) {
            console.log("Response is not JSON, trying to convert ASCII codes:");
            const convertedText = asciiToText(text);
            console.log("CONVERTED TEXT:", convertedText);
        }
    }
    catch (error) {
        console.error("Error occurred while processing request:", error);
    }
}

make_request();