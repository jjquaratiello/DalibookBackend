const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  year: String,
  dev: Boolean,
  des: Boolean,
  pm: Boolean,
  core: Boolean,
  mentor: Boolean,
  major: String,
  minor: String,
  birthday: String,
  home: String,
  quote: String,
  picture: String,
  dartmouthTradition: String,
  favoriteThing1: String,
  favoriteThing2: String,
  favoriteThing3: String,
  funFact: String,
});

module.exports = mongoose.model("Member", memberSchema, "members"); // Explicitly bind to the 'members' collection
