import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const env = envSchema.parse(process.env);
  if (env.JWT_SECRET.length < 32) {
    // eslint-disable-next-line no-console
    console.warn(
      "Warning: JWT_SECRET is weak (recommended >= 32 characters).",
    );
  }
  return env;
}

