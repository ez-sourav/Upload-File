require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file");
const multerErrorHandler = require("./middlewares/multerErrorHandler");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes); 

app.use(multerErrorHandler);

module.exports = app;
