import express from "express";

import dotenv from "dotenv";
import v1Router from "./Router/index.js";
import connectdb from "./Config/Db.js";
import cors from "cors";
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();


const app = express();
app.use(express.json());
app.use(
  cors({origin:'http://localhost:5173',  credentials: true})
  );
app.use(cookieParser());
connectdb();

app.use(express.json());

// Define routes after middleware
 app.use("/v1",v1Router);




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

