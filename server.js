const express = require("express");
const app = express();
const cors = require("cors");
const { port } = require("./env");
const connectDB = require("./utils/db");
const userRoute = require("./routes/authRoute");
const dotenv = require("dotenv");
const newsRoute = require("./routes/newsRoute");

dotenv.config();

// middleware
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// End Point

app.use("/api", userRoute);
app.use("/api", newsRoute);

app.get("/", (req, res) => res.send("Hello World!"));

connectDB();
app.listen(port, () => {
  console.log("Server running successfull" + port);
});
