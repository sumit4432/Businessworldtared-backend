const NewsLetter = require("../model/newsletter");

exports.newsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const newEmail = new NewsLetter({ email });
    await newEmail.save();
    console.log(newEmail);
    return res.status(200).json({ message: "Email saved successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save email." });
  }
};
