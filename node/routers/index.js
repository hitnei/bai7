const express = require("express");
const router = express.Router();
const { signup } = require("../controllers");

router.get("/signup", signup);