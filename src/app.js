const express = require('express');
const app = express();
require('dotenv').config();
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


// Cấu hình view engine
const configViewEngine = require('./config/viewEngine');
configViewEngine(app);


// Middleware
app.use(express.json());
app.use(expressLayout);
app.set('layout', 'layouts/main');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
            req.user = decoded;
        } catch (err) {
            res.locals.user = null;
            req.user = null;
        }
    } else {
        res.locals.user = null;
        req.user = null;
    }
    next();
});

// Routes
const webRoutes = require('./routes/web');
app.use('/', webRoutes);


// Khởi động server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
