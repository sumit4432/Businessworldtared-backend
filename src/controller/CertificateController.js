const Certificate = require("../model/CertificateEnquiry.js"); // Import the correct model

// Create a new Certificate entry
exports.createCertificateEnquiry = async (req, res) => {
  try {
    const certificateEnquiry = new Certificate(req.body); // Use the correct model
    const savedcertificateEnquiry = await certificateEnquiry.save();
    res.status(201).json(savedcertificateEnquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Fat entries
exports.getCertificateEnquiry = async (req, res) => {
  try {
    const getsavedCertificateEnquiry = await Certificate.find();
    res.status(200).json(getsavedCertificateEnquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Certificate entry by ID
exports.getCertificateEnquiryById = async (req, res) => {
  try {
    const certificateEnquiry = await Certificate.findById(req.params.id);
    if (!certificateEnquiry) {
      return res.status(404).json({ error: "Certificate entry not found" });
    }
    res.status(200).json(certificateEnquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a CertificateEnquiry by ID

exports.deleteCertificateEnquiry = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const deletedCertificate = await Certificate.findByIdAndDelete(
      certificateId
    );

    if (!deletedCertificate) {
      return res.status(404).json({ error: "Certificate not found." });
    }

    res.json({ message: "Certificate deleted successfully." });
  } catch (error) {
    next(error);
  }
};
