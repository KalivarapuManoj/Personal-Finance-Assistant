import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req,res,next) => {
    console.log(req.path,req.method);
    next();
});


// Routes
app.use("/api/transactions", transactionRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
