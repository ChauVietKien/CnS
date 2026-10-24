const prisma = require("../config/prisma");

const createTutor = async (newItem) => {
  try {
    const { userId, name, phone, age, imagebg, description, avatar } = newItem;

    if (!userId) {
      return {
        status: "ERR",
        message: "Thieu id user!",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        status: "ERR",
        message: "Khong co thong tin user!",
      };
    }

    const existingProfile = await prisma.tutor_profile.findUnique({
      where: { userId: userId },
    });

    if (existingProfile) {
      return {
        status: "ERR",
        message: "Tutor profile da ton tai!",
      };
    }

    if (!name) {
      return {
        status: "ERR",
        message: "Name la bat buoc!",
      };
    }

    // Transaction: tao profile + cap nhat role thanh tutor
    const [created_tutor] = await prisma.$transaction([
      prisma.tutor_profile.create({
        data: {
          userId: userId,
          name: name,
          age: age,
          phone: phone,
          imagebg: imagebg,
          description: description,
          avatar: avatar,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { role: "tutor" },
      }),
    ]);

    return {
      status: "OK",
      message: "Create profile success!",
      data: created_tutor,
    };
  } catch (err) {
    console.log("Create profile failed!", err);
    return {
      status: "ERR",
      message: "Internal Server Error",
    };
  }
};

const getTutorProfile = async (userId) => {
  try {
    const profile = await prisma.tutor_profile.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        evaluations: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return {
        status: "ERR",
        message: "Tutor profile not found!",
      };
    }

    // Tinh trung binh rating
    const totalRatings = profile.evaluations.length;
    const avgRating =
      totalRatings > 0
        ? (
            profile.evaluations.reduce((sum, e) => sum + e.rating, 0) /
            totalRatings
          ).toFixed(1)
        : 0;

    return {
      status: "OK",
      message: "Get tutor profile success!",
      data: {
        ...profile,
        avgRating: Number(avgRating),
        totalRatings,
      },
    };
  } catch (err) {
    console.log("Get tutor profile failed!", err);
    return {
      status: "ERR",
      message: "Internal Server Error",
    };
  }
};

const getAllTutors = async () => {
  try {
    const tutors = await prisma.tutor_profile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        evaluations: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Tinh trung binh rating cho tung tutor
    const tutorsWithRating = tutors.map((tutor) => {
      const totalRatings = tutor.evaluations.length;
      const avgRating =
        totalRatings > 0
          ? (
              tutor.evaluations.reduce((sum, e) => sum + e.rating, 0) /
              totalRatings
            ).toFixed(1)
          : 0;
      return {
        ...tutor,
        avgRating: Number(avgRating),
        totalRatings,
      };
    });

    return {
      status: "OK",
      message: "Get all tutors success!",
      data: tutorsWithRating,
    };
  } catch (err) {
    console.log("Get all tutors failed!", err);
    return {
      status: "ERR",
      message: "Internal Server Error",
    };
  }
};

const updateTutorProfile = async (userId, data) => {
  try {
    const profile = await prisma.tutor_profile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      return {
        status: "ERR",
        message: "Tutor profile not found!",
      };
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.imagebg !== undefined) updateData.imagebg = data.imagebg;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    const updatedProfile = await prisma.tutor_profile.update({
      where: { userId: userId },
      data: updateData,
    });

    return {
      status: "OK",
      message: "Update tutor profile success!",
      data: updatedProfile,
    };
  } catch (err) {
    console.log("Update tutor profile failed!", err);
    return {
      status: "ERR",
      message: "Internal Server Error",
    };
  }
};

const deleteTutorProfile = async (userId) => {
  try {
    const profile = await prisma.tutor_profile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      return {
        status: "ERR",
        message: "Tutor profile not found!",
      };
    }

    // Transaction: xoa profile + doi role ve student
    await prisma.$transaction([
      prisma.tutor_profile.delete({
        where: { userId: userId },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { role: "student" },
      }),
    ]);

    return {
      status: "OK",
      message: "Delete tutor profile success!",
    };
  } catch (err) {
    console.log("Delete tutor profile failed!", err);
    return {
      status: "ERR",
      message: "Internal Server Error",
    };
  }
};

module.exports = {
  createTutor,
  getTutorProfile,
  getAllTutors,
  updateTutorProfile,
  deleteTutorProfile,
};
