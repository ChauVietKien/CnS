const StudentProfileService = require("../services/student_profile.service.js");

const createStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, age } = req.body;

    const response = await StudentProfileService.createStudentProfile({
      userId,
      name,
      phone,
      age,
    });
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(201).json(response);
  } catch (err) {
    console.log("Create Student Profile Controller Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "userId is required!" });
    }

    const response = await StudentProfileService.getStudentProfile(userId);
    if (response.status === "ERR") return res.status(404).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Get Student Profile Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "userId is required!" });
    }

    const response = await StudentProfileService.updateStudentProfile(
      userId,
      req.body,
    );
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Update Student Profile Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const deleteStudentProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "userId is required!" });
    }

    const response = await StudentProfileService.deleteStudentProfile(userId);
    if (response.status === "ERR") return res.status(400).json(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log("Delete Student Profile Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
};
