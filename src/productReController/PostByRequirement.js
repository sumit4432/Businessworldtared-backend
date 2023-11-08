const PostByRequirement = require("../model/PostByRequirment");

exports.PostByRequirement = async (req, res) => {
  try {
    const {
      Name,
      porductName,
      quantity,
      email,
      Requirement_Frequancy,
      purposeOfReq,
      Mobile,
    } = req.body;
    const post = new PostByRequirement({
      Name,
      porductName,
      quantity,
      email,
      Requirement_Frequancy,
      purposeOfReq,
      Mobile,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const posts = await PostByRequirement.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
