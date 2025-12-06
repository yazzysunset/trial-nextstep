import { generateObject } from "ai"
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

export type LifestyleAssessment = z.infer<typeof lifestyleAssessmentSchema>

export async function assessLifestyle(userResponses: Record<string, any>): Promise<LifestyleAssessment> {
  const prompt = `
    Based on the following student lifestyle information, provide a comprehensive lifestyle assessment:
    
    ${Object.entries(userResponses)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")}
    
    Provide a detailed assessment including sleep habits, exercise frequency, diet quality, stress level, work-life balance, 
    social connection, mental health status, time management, and financial wellness. 
    
    Generate an overall wellness score (0-100), identify strengths and areas for improvement, 
    provide specific recommendations, and highlight any risk factors.
    
    Consider the student context - they have academic workload, budget constraints, and need to balance multiple responsibilities.
  `

  const { object } = await generateObject({
    model: "openai/gpt-5",
    schema: lifestyleAssessmentSchema,
    prompt,
    maxOutputTokens: 2000,
  })

  return object
}
