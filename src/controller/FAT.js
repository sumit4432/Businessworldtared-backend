const Fat = require("../model/FTA");

// Create a new Fat entry
exports.createFat = async (req, res) => {
  try {
    const fat = new Fat(req.body);
    const savedFat = await fat.save();
    res.status(201).json(savedFat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Fat entries
exports.getAllFat = async (req, res) => {
  try {
    const fats = await Fat.find();
    res.status(200).json(fats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Fat entry by ID
exports.getFatById = async (req, res) => {
  try {
    const fat = await Fat.findById(req.params.id);
    if (!fat) {
      return res.status(404).json({ error: "Fat entry not found" });
    }
    res.status(200).json(fat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Fat entry by ID
exports.updateFatById = async (req, res) => {
  try {
    const fat = await Fat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!fat) {
      return res.status(404).json({ error: "Fat entry not found" });
    }
    res.status(200).json(fat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Fat entry by ID
exports.deleteFatById = async (req, res) => {
  try {
    const fat = await Fat.findByIdAndRemove(req.params.id);
    if (!fat) {
      return res.status(404).json({ error: "Fat entry not found" });
    }
    res.status(204).json("delete FTA Successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
