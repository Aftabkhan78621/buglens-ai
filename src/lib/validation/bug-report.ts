
import { z } from "zod";

export const bugReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Bug title must contain at least 5 characters.")
    .max(120, "Bug title cannot exceed 120 characters."),

  description: z
    .string()
    .trim()
    .min(20, "Please describe the bug in at least 20 characters.")
    .max(5000, "Description cannot exceed 5000 characters."),

  environment: z.enum([
    "Development",
    "Staging",
    "Production",
    "Testing",
  ]),

  expectedBehavior: z
    .string()
    .trim()
    .max(2000, "Expected behavior cannot exceed 2000 characters.")
    .default(""),

  actualBehavior: z
    .string()
    .trim()
    .max(2000, "Actual behavior cannot exceed 2000 characters.")
    .default(""),

  logs: z
    .string()
    .trim()
    .max(10000, "Logs cannot exceed 10000 characters.")
    .default(""),
});

export type ValidatedBugReport = z.infer<typeof bugReportSchema>;
