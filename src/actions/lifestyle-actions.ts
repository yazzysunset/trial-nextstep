"use server"

import { generateObject, generateText } from "ai"
import { z } from "zod"

const lifestyleAssessmentSchema = z.object({
  sleepHabits: z.string().describe("Assessment of sleep patterns and quality"),
  exerciseFrequency: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .describe("Weekly exercise frequency"),
  dietQuality: z.enum(["poor", "fair", "good", "excellent"]).describe("Overall diet quality assessment"),
  stressLevel: z.enum(["low", "moderate", "high", "very_high"]).describe("Current stress level"),
  workLifeBalance: z.enum(["poor", "fair", "good", "excellent"]).describe("Work-life balance assessment"),
  socialConnection: z.enum(["isolated", "limited", "moderate", "strong"]).describe("Level of social connection"),
  mentalHealthStatus: z.enum(["struggling", "fair", "good", "excellent"]).describe("Overall mental health assessment"),
  timeManagement: z.enum(["poor", "fair", "good", "excellent"]).describe("Time management effectiveness"),
  financialWellness: z
    .enum(["struggling", "fair", "stable", "thriving"])
    .describe("Financial health based on spending patterns"),
  overallScore: z.number().min(0).max(100).describe("Overall lifestyle wellness score (0-100)"),
  strengths: z.array(z.string()).describe("Key lifestyle strengths identified"),
  areasForImprovement: z.array(z.string()).describe("Areas that need improvement"),
  recommendations: z.array(z.string()).describe("Personalized recommendations for lifestyle improvement"),
  riskFactors: z.array(z.string()).describe("Potential risk factors or concerns identified"),
})

export type LifestyleAssessmentResult = z.infer<typeof lifestyleAssessmentSchema>

export async function analyzeStudentLifestyle(userResponses: Record<string, any>): Promise<LifestyleAssessmentResult> {
  const prompt = `
You are an expert wellness coach and student lifestyle counselor. Based on the following student responses, 
provide a comprehensive lifestyle assessment:

${Object.entries(userResponses)
  .map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase()
    return `${formattedKey}: ${value}`
  })
  .join("\n")}

Please analyze:
1. Sleep quality and patterns
2. Physical activity levels
3. Diet and nutrition habits
4. Stress management
5. Academic-work balance
6. Social connections
7. Mental health status
8. Time management skills
9. Financial wellness

Provide specific, actionable recommendations tailored to student life.
Include an overall wellness score (0-100) where:
- 0-25: Critical - immediate attention needed
- 26-50: Poor - significant improvements needed
- 51-75: Fair - some areas need work
- 76-100: Good - healthy lifestyle maintained
`

  const { object } = await generateObject({
    model: "openai/gpt-5",
    schema: lifestyleAssessmentSchema,
    prompt,
    maxOutputTokens: 2500,
  })

  return object
}

export async function generateLifestyleInsights(assessment: LifestyleAssessmentResult): Promise<string> {
  const { text } = await generateText({
    model: "openai/gpt-5",
    prompt: `
Based on this lifestyle assessment:
${JSON.stringify(assessment, null, 2)}

Generate a brief, motivational summary (2-3 paragraphs) that:
1. Acknowledges the student's current situation
2. Highlights their progress and strengths
3. Provides hope and actionable next steps
4. Emphasizes the connection between lifestyle choices and academic/financial success
    `,
    maxOutputTokens: 500,
  })

  return text
}

export async function getPersonalizedMotivation(area: string): Promise<string> {
  const { text } = await generateText({
    model: "openai/gpt-5",
    prompt: `
Generate a personalized, motivational message for a student who needs to improve in the area of: "${area}"

The message should:
1. Be empathetic and understanding
2. Provide 3-5 specific, actionable tips
3. Include realistic quick wins (things they can do today/this week)
4. Connect the improvement to their overall success as a student

Keep it concise and encouraging.
    `,
    maxOutputTokens: 400,
  })

  return text
}
