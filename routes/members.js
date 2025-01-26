const express = require("express");
const Member = require("../models/Member");
const router = express.Router();

// Get all members
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.year) query.year = req.query.year; 
    if (req.query.major) query.major = req.query.major;
    if (req.query.role) query[req.query.role] = true; 

    const members = await Member.find(query);
    
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new member
router.post("/", async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email parameter is required." });
    }

    console.log("Fetching member with email:", email);

    const member = await Member.findOne({ email: email.trim() });

    res.status(200).json({
      exists: !!member,
      member: member || null,
    });
  } catch (err) {
    console.error("Error fetching member by email:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get a single member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.status(200).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update a member by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMember) return res.status(404).json({ error: "Member not found" });
    res.status(200).json(updatedMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Aggregate members by year
router.get("/aggregate/year", async (req, res) => {
  try {
    const result = await Member.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggregate members by major
router.get("/aggregate/major", async (req, res) => {
  try {
    const result = await Member.aggregate([
      { $group: { _id: "$major", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/aggregate/role", async (req, res) => {
  try {
    const result = await Member.aggregate([
      { $group: { _id: { dev: "$dev", des: "$des", pm: "$pm" }, count: { $sum: 1 } } },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Find related members by role or major
router.get("/related/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const relatedMembers = await Member.find({
      $or: [{ major: member.major }, { dev: member.dev }, { des: member.des }, { pm: member.pm }],
      _id: { $ne: member._id },
    });

    res.status(200).json({ member, relatedMembers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
