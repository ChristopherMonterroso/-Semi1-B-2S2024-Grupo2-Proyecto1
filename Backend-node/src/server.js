
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db").connectDB;
const { db } = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Node.js server running on port 5000");
  });
  
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await db.sync();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();