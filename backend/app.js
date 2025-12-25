require("dotenv").config();
const express = require('express');

const fileRoutes = require('./routes/file');

const app =express();

app.use(express.json());
app.use('/files',fileRoutes);

module.exports = app;