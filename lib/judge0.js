import axios from "axios"

export function getJudge0LanguageId(language){
    language = language.toUpperCase()
    const languageMap = {
        "CPP": 54,
        "JAVA": 62,
        "PYTHON": 71,
        "JAVASCRIPT": 63,
    }
    return languageMap[language]
}


export async function submitBatchToJudge0(submissions){
     const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {submissions})
     console.log("Judge0 batch submission response: ", data)
     return data
}


export async function pollAndGetBatchResultsFromJudge0(tokens){
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens: tokens.join(","),
                base64_encoded: false
            }
        })
        console.log("Judge0 batch results response: ", data)
        const result = data.submissions
        const isAllDone = result.every(r => r.status.id !== 1 && r.status.id !== 2)
        if(isAllDone){
            return result
        }
        await sleep(1000)
    }
}