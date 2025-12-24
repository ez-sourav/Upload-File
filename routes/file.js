const express = require("express");
const fs = require("fs");
const path = require("path");
const File = require("../models/file");
const upload = require("../middlewares/upload");
const router = express.Router();

// Upload file

router.post('/upload',upload.single("file"),async(req,res)=>{
    const file = await File.create({
        originalName:req.file.originalname,
        fileName:req.file.filename,
        fileType:req.file.mimetype,
        size:req.file.size,
        path:req.file.path
    });

    req.json({
        message:"File Upload Successfully",
        file
    });
    
})