    const express = require('express');
    require("dotenv").config();
    const bodyParser = require('body-parser');
    const router = require('./routes/user.routes');
    const cors = require('cors');
    const fileUpload = require("express-fileupload");
    const app = express();
    const path = require('path');

    app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload());
    app.use(cors());
    app.use('/api',router);

    const PORT = process.env.PORT;


    // Start server
    app.listen(PORT, () => {
        console.log(`Server started successfully on Port ${PORT}`);
    });
