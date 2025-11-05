import { z } from "zod";

export const JobApplicationBody = z.object({
    title: z.string().min(5).max(45)
    .transform((val) => {
        return val
        .trim()
        .replace(/\s+/g, " ")
    }),
    company: z.string().min(3).max(25),
    description: z.string().max(200)
    .transform((val) => {
        return val
        .trim()
        .replace(/\s+/g, " ")
    }),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    isClosed: z.boolean()
})

export type JobApplicationType = z.infer<typeof JobApplicationBody>;