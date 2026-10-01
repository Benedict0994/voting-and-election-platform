import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import settingsRoutes from "./routes/SettingsRoutes";
import voteRoutes from "./routes/voteRoutes";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/votes", voteRoutes);

app.get("/", (_req, res) => {
  res.send("Voting API is running");
});

export default app;
