const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../solution/db");
const router = Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  await Admin.create({
    username: username,
    password: password,
  });

  res.json({
    msg: "Admin created successfully",
  });
});

router.post("/signin", (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  Admin.findOne({ username, password }).then((result) => {
    if (result) {
      var token = jwt.sign({ username: username }, JWT_SECRET);
      res.status(200).json({
        token: `your-token - ${token}`,
      });
    } else {
      res.status(411).json({
        msg: "Incorrect email and pass",
      });
    }
  });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  await Course.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
  });

  res.json({
    msg: "course created successfully",
  });
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
  const result = Course.findOne({});
  if (result) {
    return result;
  } else {
    throw new Error();
  }
});

module.exports = router;
