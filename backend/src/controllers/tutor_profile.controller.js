const TutorProfileService = require("../services/tutor_profille.service.js");

const createTutor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, age, imagebg, description, avatar } = req.body;

    const response = await TutorProfileService.createTutor({
      userId,
      name,
      phone,
      age,
      imagebg,
      description,
      avatar,
    });
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(201).json(response);
  } catch (err) {
    console.log("Create Tutor Controller Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getTutorProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "userId is required!" });
    }

    const response = await TutorProfileService.getTutorProfile(userId);
    if (response.status === "ERR") return res.status(404).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Get Tutor Profile Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getAllTutors = async (req, res) => {
  try {
    const response = await TutorProfileService.getAllTutors();
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Get All Tutors Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const updateTutorProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "userId is required!" });
    }

    const response = await TutorProfileService.updateTutorProfile(
      userId,
      req.body,
    );
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Update Tutor Profile Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const deleteTutorProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "userId is required!" });
    }

    const response = await TutorProfileService.deleteTutorProfile(userId);
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Delete Tutor Profile Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

module.exports = {
  createTutor,
  getTutorProfile,
  getAllTutors,
  updateTutorProfile,
  deleteTutorProfile,
};
