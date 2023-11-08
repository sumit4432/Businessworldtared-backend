const Callback = require("../model/callbacke");

exports.createCallback = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const newCallback = new Callback({
      name,
      email,
      phone,
      message,
      createdAt: new Date(),
    });

    const savedCallback = await newCallback.save();

    res.status(201).json(savedCallback);
  } catch (error) {
    next(error);
  }
};

// Get all callbacks
exports.getCallbacks = async (req, res, next) => {
  try {
    const callbacks = await Callback.find();

    res.json(callbacks);
  } catch (error) {
    next(error);
  }
};

// Get a single callback by ID
exports.getCallbackById = async (req, res, next) => {
  try {
    const { callbackId } = req.params;

    const callback = await Callback.findById(callbackId);

    if (!callback) {
      return res.status(404).json({ error: "Callback not found." });
    }

    res.json(callback);
  } catch (error) {
    next(error);
  }
};

// Update a callback by ID
exports.updateCallback = async (req, res, next) => {
  try {
    const { callbackId } = req.params;
    const updateData = req.body;

    const updatedCallback = await Callback.findByIdAndUpdate(
      callbackId,
      updateData,
      { new: true }
    );

    if (!updatedCallback) {
      return res.status(404).json({ error: "Callback not found." });
    }

    res.json(updatedCallback);
  } catch (error) {
    next(error);
  }
};

// Delete a callback by ID

exports.deleteCallback = async (req, res, next) => {
  try {
    const { callbackId } = req.params;

    const deletedCallback = await Callback.findByIdAndDelete(callbackId);

    if (!deletedCallback) {
      return res.status(404).json({ error: "Callback not found." });
    }

    res.json({ message: "Callback deleted successfully." });
  } catch (error) {
    next(error);
  }
};
