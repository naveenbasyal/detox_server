const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const dailyEntriesRoutes = require("./routes/dailyEntriesRoutes");
const challengesRoutes = require("./routes/challengesRoutes");
const chatRoutes = require("./routes/chatRoutes");
const ChatMessage = require("./models/chatModel");
dotenv.config();
const cron = require("node-cron");
const notifier = require("node-notifier");

// Schedule notifications to be sent at 9:20 PM
cron.schedule("30 21 * * *", () => {
  // Send a customized system notification at 9:20 PM
  notifier.notify({
    title: "DetoxifyMe",
    message: "Don't forget to write your post!",
    icon: "./assets/images/favicon.png",
  });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(process.env.CLIENT_URL);
const corsOptions = {
  origin: "https://detoxifyme.netlify.app" || "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Required for cookies, authorization headers, etc.
};
app.use(cors(corsOptions));

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connected & Server running on http://localhost:${port}`);
    http.listen(port);
  })
  .catch((error) => {
    console.error("DB Connection Error:", error);
  });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Socket.io
io.on("connection", (socket) => {
  socket.on("chat message", async (message) => {
    const chatMessage = new ChatMessage(message);
    await chatMessage.save();

    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/daily-entries", dailyEntriesRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/chat", chatRoutes);
