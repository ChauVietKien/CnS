require("dotenv").config()
const express = require("express")
const routes = require('./src/routes')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.URL_FE || "http://localhost:3000",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

routes(app);

app.listen(5000, () => console.log("Run on port 5000!"));