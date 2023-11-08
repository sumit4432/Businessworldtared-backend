const Inquiries = require("../model/Inquiries");

exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Create a new inquiry document
    const newInquiry = new Inquiries({
      name,
      email,
      phone,
    });

    // Save the inquiry to the database
    await newInquiry.save();

    res.status(201).json({ inquiry: newInquiry });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Error creating inquiry" });
  }
};

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiries.find();
    res.status(200).json({ inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Error fetching inquiries" });
  }
};
exports.getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiries.findById(id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ inquiry });
  } catch (error) {
    console.error("Error fetching inquiry by ID:", error);
    res.status(500).json({ message: "Error fetching inquiry by ID" });
  }
};

exports.updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const updatedInquiry = await Inquiries.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ inquiry: updatedInquiry });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ message: "Error updating inquiry" });
  }
};

// Delete an inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInquiry = await Inquiries.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Error deleting inquiry" });
  }
};
