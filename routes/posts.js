const router = require("express").Router();
const verified = require("../verifyToken");

router.get("/", verified, (req, res) => {
  res.json({
    posts: {
      title: "My first post",
      description: "Random data with no access",
    },
  });
});

module.exports = router;
