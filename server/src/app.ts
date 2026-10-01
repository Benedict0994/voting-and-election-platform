import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import settingsRoutes from "./routes/SettingsRoutes";
import voteRoutes from "./routes/voteRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { paystackWebhook } from "./controllers/paymentController";
import { env } from "./config/env";

const app = express();
app.use(cors({origin:env.CLIENT_URL,credentials:true}));
// Webhook must receive the exact raw request body so its Paystack signature can be verified.
app.post("/api/payments/webhook/paystack",express.raw({type:"application/json"}),paystackWebhook);
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/candidates",candidateRoutes);
app.use("/api/settings",settingsRoutes);
app.use("/api/votes",voteRoutes);
app.use("/api/payments",paymentRoutes);
app.get("/",(_req,res)=>{res.send("Voting API is running")});
export default app;
