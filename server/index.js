const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const filesRoute = require("./routes/files");
require("dotenv").config();
var cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route Middlewares
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/files", filesRoute);

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start server
app.listen(8000, () => console.log("Server up and running on port 8000"));
