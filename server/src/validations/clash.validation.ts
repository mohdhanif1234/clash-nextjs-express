import { z } from "zod";

export const clashSchema = z
    .object({
        title: z
            .string({ message: "Title field is required." })
            .min(3, { message: "Title must be 3 characters long." })
            .max(60, { message: "Title can be of maximum 60 characters" }),
        description: z
            .string({ message: "Description field is required." })
            .min(3, { message: "Description must be 10 characters long." })
            .max(500, { message: "Description can be of maximum 500 characters" }),
        expires_at: z
            .string({ message: "Expires at field is required." })
            .min(3, { message: "Please pass correct date." }),
        image: z
            .string()
            .optional()
    })