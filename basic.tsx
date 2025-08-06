import 'dotenv/config';

console.log('GEMINI_API_KEY:', process.env.GOOGLE_API_KEY);

const Keys = () => {
    return process.env.GOOGLE_API_KEY;
}


export default Keys;