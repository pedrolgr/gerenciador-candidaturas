import { z } from "zod";

export const JobApplicationBody = z.object({
    title: z.string().min(5).max(45)
        .transform((val) => {
            return val
                .trim()
                .replace(/\s+/g, " ")
        }),
    company: z.string().max(25).optional(),
    description: z.string().max(200)
        .transform((val) => {
            return val
                .trim()
                .replace(/\s+/g, " ")
        }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    isClosed: z.coerce.date().optional()
})

export type JobApplicationType = z.infer<typeof JobApplicationBody>;