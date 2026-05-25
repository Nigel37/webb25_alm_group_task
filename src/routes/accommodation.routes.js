const router = require("express").Router();
const {
  createAccommodation,
  getAllAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodation.controller");

router.post("/", createAccommodation);
router.get("/", getAllAccommodations);
router.get("/:id", getAccommodationById);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);

module.exports = router;
