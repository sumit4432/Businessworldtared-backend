const Contactus = require("../model/contactus");

exports.createContactus = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, query } = req.body;

    // if (!firstName || !lastName || !email || !phone || !query) {
    //   return res.status(400).json({ error: "All fields are required." });
    // }

    const newContactus = new Contactus({
      firstName,
      lastName,
      email,
      phone,
      query,
    });

    await newContactus.save();

    console.log(newContactus); // Logging the new contactus data to the console

    res.status(201).json({ message: "Contactus created successfully." });
  } catch (error) {
    next(error);
  }
};
