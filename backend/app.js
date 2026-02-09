require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(routes);

// server start (ONLY place PORT exists)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
