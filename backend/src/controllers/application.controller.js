const ApplicationService = require("../services/application.service.js");

const createApplication = async (req, res) => {
  try {
    const { postId, name, email, phone, className, note } = req.body;

    console.log("id", req.user.id);
    const studentId = req.user.id;

    const response = await ApplicationService.createApplication({
      postId,
      studentId,
      name,
      email,
      phone,
      className,
      note,
    });

    if (response.status === "ERR") return res.status(400).json(response);
    return res.status(201).json(response);
  } catch (err) {
    console.log("Create Application Controller Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getPersonalApplication = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Application ID is required!" });
    }

    const response = await ApplicationService.getPersonalApplication(id);
    if (response.status === "ERR") return res.status(404).json(response);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Get Application Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // filter
    const response = await ApplicationService.getAllApplications(status);

    if (response.status === "ERR") return res.status(400).json(response);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Get All Applications Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getApplicationsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "postId is required!" });
    }

    const response = await ApplicationService.getApplicationsByPost(postId);
    if (response.status === "ERR") return res.status(400).json(response);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Get Applications By Post Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const getApplicationsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    if (!studentId) {
      return res
        .status(400)
        .json({ status: "ERR", message: "studentId is required!" });
    }

    const response =
      await ApplicationService.getApplicationsByStudent(studentId);
    if (response.status === "ERR") return res.status(400).json(response);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Get Applications By Student Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        status: "ERR",
        message: "Application ID and status are required!",
      });
    }

    const response = await ApplicationService.updateApplicationStatus(
      id,
      status,
    );
    if (response.status === "ERR") return res.status(400).json(response);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Update Application Status Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .json({ status: "ERR", message: "Application ID is required!" });
    }

    const response = await ApplicationService.deleteApplication(id);
    if (response.status === "ERR") return res.status(400).json(response);
    return res.status(200).json(response);
  } catch (err) {
    console.log("Delete Application Error:", err);
    return res
      .status(500)
      .json({ status: "ERR", message: "Internal Server Error" });
  }
};

module.exports = {
  createApplication,
  getPersonalApplication,
  getAllApplications,
  getApplicationsByPost,
  getApplicationsByStudent,
  updateApplicationStatus,
  deleteApplication,
};
