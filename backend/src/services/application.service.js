const prisma = require("../config/prisma");

const createApplication = async (newApplication) => {
  try {
    const { postId, studentId, name, email, phone, className, note } =
      newApplication;
    console.log("req", postId, studentId, name, email, phone, className, note);
    if (!postId || !name || !email || !phone || !className || !studentId) {
      return {
        status: "ERR",
        message:
          "Thieu thong tin bat buoc (postId, name, email, phone, class)!",
      };
    }

    // Kiem tra post co ton tai khong
    const post = await prisma.tutor_post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return { status: "ERR", message: "Post not found!" };
    }

    const createdApp = await prisma.application.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        class: className,
        note: note || null,
        postId: postId,
        studentId: studentId,
      },
    });

    return {
      status: "OK",
      message: "Create application success!",
      data: createdApp,
    };
  } catch (err) {
    console.log("Create application failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
  }
};

const getPersonalApplication = async (id) => {
  try {
    if (!id) {
      return res
        .status(400)
        .json({ status: "ERR", message: "ID không được để trống!" });
    }

    const app = await prisma.application.findMany({
      where: { studentId: id },
      include: {
        post: {
          select: {
            id: true,
            subject: true,
            Class: true,
            method: true,
            address: true,
            price: true,
            tutor: {
              select: {
                id: true,
                name: true,
              },
            },
            schedules: {
              select: {
                day: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!app) {
      return { status: "ERR", message: "Application not found!" };
    }

    return {
      status: "OK",
      message: "Get application success!",
      data: app,
    };
  } catch (err) {
    console.log("Get application failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
  }
};

const getAllApplications = async (status) => {
  try {
    const whereClause = status ? { status: status } : {};
    const apps = await prisma.application.findMany({
      where: whereClause,
      include: {
        post: {
          select: {
            id: true,
            subject: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: "OK",
      message: "Get all applications success!",
      data: apps,
    };
  } catch (err) {
    console.log("Get all applications failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
  }
};

const getApplicationsByPost = async (postId) => {
  try {
    const apps = await prisma.application.findMany({
      where: { postId: postId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: "OK",
      message: "Get applications by post success!",
      data: apps,
    };
  } catch (err) {
    console.log("Get applications by post failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
  }
};

const getApplicationsByStudent = async (studentId) => {
  try {
    const apps = await prisma.application.findMany({
      where: { studentId: studentId },
      include: {
        post: {
          select: {
            id: true,
            subject: true,
            Class: true,
            tutor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: "OK",
      message: "Get applications by student success!",
      data: apps,
    };
  } catch (err) {
    console.log("Get applications by student failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
  }
};

const updateApplicationStatus = async (id, status) => {
  try {
    if (!["pending", "approved", "rejected"].includes(status)) {
      return { status: "ERR", message: "Status không hợp lệ!" };
    }

    const app = await prisma.application.findUnique({
      where: { id },
    });

    if (!app) {
      return { status: "ERR", message: "Application not found!" };
    }

    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status: status },
    });

    return {
      status: "OK",
      message: "Update application status success!",
      data: updatedApp,
    };
  } catch (err) {
    console.log("Update application status failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
  }
};

const deleteApplication = async (id) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id },
    });

    if (!app) {
      return { status: "ERR", message: "Application not found!" };
    }

    await prisma.application.delete({
      where: { id },
    });

    return {
      status: "OK",
      message: "Delete application success!",
    };
  } catch (err) {
    console.log("Delete application failed!", err);
    return { status: "ERR", message: "Internal Server Error" };
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
