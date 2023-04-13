const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const PORT = process.env.PORT;

// Conntect to DB
mongoose.connect(process.env.DB_CONNECT);

//Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//Middleware
app.use(express.json());

//Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => console.log(`Listening in port ${PORT}`));
