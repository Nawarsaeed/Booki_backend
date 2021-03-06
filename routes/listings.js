const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const config = require("config");
const fs = require("fs");
const imageResize = require("../middleware/imageResize");
const validateWith = require("../middleware/validation");
const { Expo } = require("expo-server-sdk");
const { Listing, listingMapper, schema } = require("../models/listing");
const { Categories } = require("../models/categories");
const { User } = require("../models/user");
const multer = require("multer");
const sendPushNotification = require("../utilities/pushNotifications");

const outputFolder = "public/assets";

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const deleteImages = async (images) => {
  const delFull = images.map(async (image) => {
    fs.unlink(outputFolder + "/" + image.fileName + "_full.jpg", () => {});
  });
  const delThumb = images.map(async (image) => {
    fs.unlink(outputFolder + "/" + image.fileName + "_thumb.jpg", () => {});
  });
  return Promise.all([...delFull, ...delThumb]);
};

router.get("/", async (req, res) => {
  const listings = await Listing.find().select("-__v");
  const resources = listings.map(listingMapper);
  res.send(resources);
});

router.get("/:id", auth, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing)
    return res.status(404).send("The listing with the given ID was not found.");
  const resource = listingMapper(listing);
  res.send(resource);
});

router.delete("/:id", auth, async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id).select("-__v");
  if (!listing)
    return res.status(404).send("The listing with the given ID was not found.");
  await deleteImages(listing.images);
  res.send(listing);
});

router.put("/", async (req, res) => {
  const checkListing = await Listing.findById(req.body._id);
  if (!checkListing)
    return res.status(404).send("The listing with the given ID was not found.");
  const listing = await Listing.findByIdAndUpdate(
    { _id: checkListing._id },
    {
      $set: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
    },
    { new: true, useFindAndModify: false }
  );
  if (!listing)
    return res
      .status(404)
      .send("The user with the given ID was not found.");
  return res.send(listing);
});

router.post(
  "/",
  [
    auth,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    imageResize,
  ],

  async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("Invalid user ID");

    const category = await Categories.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid category ID");

    const listing = new Listing({
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: req.body.categoryId,
      description: req.body.description,
      images: req.images.map((fileName) => ({ fileName: fileName })),
      userId: user._id,
      location: JSON.parse(req.body.location),
    });

    const { expoPushToken } = user;
    console.log(req.user.recivePushNotifications);
    if ( req.user.recivePushNotifications == true){
    if (Expo.isExpoPushToken(expoPushToken))
   await sendPushNotification(expoPushToken, {
     title: "Awesome, " + req.user.name +". Your item has been published.",
     body: req.body.message,
      });
      }
    await listing.save();
    res.send(listing);

  }
);

module.exports = router;
