const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

router.get("/:recivePushNotifications",[auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("Invalid user ID");
  res.send(user);
});

router.post("/",[auth, validateWith({ token: Joi.string().required() })], async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          expoPushToken: req.body.token,
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!user) return res.status(400).send({ error: "Invalid user." });
    res.status(201).send();
  }
);

router.put("/", [auth], async (req, res) => {
    const user = await User.findOneAndUpdate(
      {_id: req.user._id},
      {
        $set: {
          recivePushNotifications: req.body.type,
        },
      },
      { new: true, useFindAndModify: false }
    );
    if (!user) return res.status(400).send({ error: "Invalid user." });
    res.status(201).send();
  }
);

module.exports = router;
