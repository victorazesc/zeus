import { z } from "zod";

export const WorkspaceCreateSchema = z.object({
    name: z.string().min(1, { message: "Workspace name is required" })
        .max(80, { message: "Workspace name should not exceed 80 characters" })
        .regex(/^[\w\s-]*$/, { message: "Name can only contain (' '), ('-'), ('_') & alphanumeric characters." }),
    slug: z.string().min(4),
});