import mongoose from "mongoose";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";


export const userModelSchema = z.object({
    userId: z.string().uuid().default(() => uuidv4()),
    name: z.string().min(1),
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
    password: z.string(),
    organizationId: z.string().uuid().optional(),  // Optional, will be auto-generated for admin
    role: z.enum(["admin", "manager", "member", "pending"]).optional(), // Optional for registration
    createdTime: z.number().nullable().optional(),
    organizationName: z.string().min(1),
});

export type UserModelType = z.infer<typeof userModelSchema>;




const userSchema = new mongoose.Schema<UserModelType>(
    {
        userId: { type: String, required: true, unique: true, default: () => uuidv4() },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
        organizationId: { type: String, required: true },
        organizationName: {type: String, required: true, unique: true},
        role: {
            type: String,
            enum: ["admin","manager","member","pending"],
            default: "pending"
        },
        createdTime: {
            type: Number,
            default: () => Date.now()
        }

    },

    {
        versionKey: false
    }

);
export const userModel = mongoose.model("User", userSchema);