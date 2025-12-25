require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file");
const multerErrorHandler = require("./middlewares/multerErrorHandler");

const app = express();

// ALLOW FRONTEND ORIGIN
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(express.json());

// routes
app.use("/files", fileRoutes);

app.use(multerErrorHandler);

module.exports = app;
