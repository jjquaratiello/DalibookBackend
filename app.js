const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Database connection error:", err));

//Routes
const memberRoutes = require("./routes/members");
app.use("/api/members", memberRoutes);
const feedRoutes = require("./routes/feed");
app.use("/api/feed", feedRoutes);
const youtubeRoutes = require("./routes/youtube");
app.use("/api/youtube", youtubeRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));