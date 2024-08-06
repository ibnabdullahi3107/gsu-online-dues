const express = require("express");
require("express-async-errors");
const { dbConnection } = require("../config/db");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares authenthications
// const authenticateUser = require("./middlewares/authentication");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1/auth", require("./routes/authentication"));
app.use("/api/v1/token", require("./routes/refresh-token"));

app.use("/api/v1/role", require("./routes/role"));
app.use("/api/v1/permission", require("./routes/permission"));
app.use("/api/v1/role-permissions", require("./routes/role-permission"));
app.use("/api/v1/faculty", require("./routes/faculty"));
app.use("/api/v1/level", require("./routes/level"));
app.use("/api/v1/department", require("./routes/department"));
app.use("/api/v1/course", require("./routes/course"));
app.use("/api/v1/association", require("./routes/association"));
app.use("/api/v1/session", require("./routes/session"));
app.use("/api/v1/students", require("./routes/student"));
app.use("/api/v1/payments", require("./routes/payment"));
app.use("/api/v1/staff", require("./routes/staff"));
app.use("/api/v1/dues", require("./routes/dues"));




// errors handlers

app.use(require("./middlewares/not-found"));
app.use(require("./middlewares/error-handler"));

const startServer = async () => {
  try {
    //  database connection
    await dbConnection();

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

// Call the function to start the server
startServer();
