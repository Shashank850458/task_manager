import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db";
import userRoutes from "./src/user/user.route";
import loginRoutes from "./src/login/login.route";
import profileRoutes from "./src/profile/profile.route";
import taskRoutes from "./src/task/task.route";
import cors from "cors";
import { getEnv } from "./src/config/env";
import { notFound } from "./src/middleware/notFound";
import { errorHandler } from "./src/middleware/errorHandler";
import morgan from "morgan";

dotenv.config({ quiet: true });

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api", profileRoutes);
app.use("/api", taskRoutes);

app.get("/", (req, res) => {
    res.send("SaaS Task Manager API Running");
});

app.use(notFound);
app.use(errorHandler);

(async () => {
    const env = getEnv();
    await connectDB(env.MONGO_URI);

    app.listen(env.PORT, () => {
        console.log(`Server started on port ${env.PORT}`);
    });
})().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Fatal startup error", err);
    process.exit(1);
});
