const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const dailyEntriesRoutes = require("./routes/dailyEntriesRoutes");
const challengesRoutes = require("./routes/challengesRoutes");
dotenv.config();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// db connection

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`DB connected & Server running on http://localhost:${port}`);
    })
  );
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/users",userRoutes);
app.use("/api/daily-entries", dailyEntriesRoutes);
app.use("/api/challenges", challengesRoutes);
