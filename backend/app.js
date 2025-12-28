require("dotenv").config();
const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/file");
const multerErrorHandler = require("./middlewares/multerErrorHandler");

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE","OPTIONS"],
  })
);



// routes
app.use("/files", fileRoutes);

app.use(multerErrorHandler);

module.exports = app;
