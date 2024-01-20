const { Router } = require("express");
const router = Router();
const User = require("../db/index");
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;
  await User.create({
    username: username,
    password: password,
  });

  res.json({
    msg: "User created successfully",
  });
});

router.post("/signin", (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username, password }).then((result) => {
    if (result) {
      var userToken = jwt.sign({ username: username }, JWT_SECRET);
      res.status(200).json({
        msg: `your token - ${userToken}`,
      });
    } else {
      res.status(403).json({
        msg: "User doesn't exist",
      });
    }
  });
});

router.get("/courses", (req, res) => {
  // Implement listing all courses logic
  const courses = User.Course.findOne({});
  if (courses) {
    return courses;
  } else {
    throw new Error();
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;

  await User.updateOne(
    {
      username: username,
    },
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  );
  res.json({
    message: "Purchase complete!",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.headers.username,
  });

  console.log(user.purchasedCourses);
  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });

  res.json({
    courses: courses,
  });
});

module.exports = router;
