import express from "express";
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../Controllers/employeeControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").post(addEmployee).get(getEmployees);
router.route("/:id").put(updateEmployee).delete(deleteEmployee);

export default router;
