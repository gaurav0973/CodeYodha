import { UserRole } from "@/generated/client";
import { pollAndGetBatchResultsFromJudge0, submitBatchToJudge0 } from "@/lib/judge0";
import prisma from "@/lib/prisma";
import { getCurrentUser, getCurrentUserRole } from "@/modules/auth/actions";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { success } from "zod";




// 1. get all fields from the request
        // 2. validations
        // 3. run loop for each lang ----> have testCases inside
            //1. get judge0 language id 
            //2. prepare submission for each test case
            //3. submit all testcase in one batch
            //4. extract tokens from responce
export async function POST(request){
    try {
        const userRole = await getCurrentUserRole()
        const user = await getCurrentUser()
        if(userRole !== UserRole.ADMIN){
            return NextResponse.json({
                error: "Unauthorized access"
            }, {status: 401})
        }

        const body = await request.json()
        const {title, description, difficulty, tags,examples, codeSnippets,referenceSolution, constraints, testCases} = body

        // basic validation
        if(!title || !description || !difficulty || !tags || !examples || !codeSnippets || !referenceSolution || !constraints || !testCases){
            return NextResponse.json({
                error: "All fields are required"
            }, {status: 400})
        }
        if(!Array.isArray(testCases) || testCases.length === 0){
            return NextResponse.json({
                error: "At least one test case is required"
            }, {status: 400})
        }
        if(!referenceSolution || typeof referenceSolution !== 'object'){
            return NextResponse.json({
                error: "Reference solution must be provided for all the languages"
            }, {status: 400})
        }
        
        for(const [language, solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language)
            if(!languageId){
                return NextResponse.json({
                    error: `Unsupported language: ${language}`
                }, {status: 400})
            }

            const submissions = testCases.map((input, output)=>{
                return {
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output
                }
            })


            const submissionResult = await submitBatchToJudge0(submissions)
            const tokens = submissionResult.map(submission => submission.token)
            const results = await pollAndGetBatchResultsFromJudge0(tokens)

            // save the results to database
            for(let i=0; i<results.length; i++){
                const res = results[i]
                if(res.status.id !== 3){
                    return NextResponse.json({
                        error: `Reference solution failed for language ${language} on test case ${i+1}`
                    }, {status: 400})
                }
                // save each result to database
            }
        }

        const newProblem = await prisma.problem.create({
            data:{
                title,
                description,
                difficulty,
                tags,
                examples,
                codeSnippets,
                testCases,
                referenceSolution,
                constraints,
                userId: user.id
            }
        })

        return NextResponse.json({
            success: true,
            message: "Problem created successfully",
            data: newProblem
        }, {status: 201})
        

        
    } catch (error) {
        return NextResponse.json({
            error: "Failed to save problem to DBHey, Cortana. "
        }, {status: 500})
    }
}