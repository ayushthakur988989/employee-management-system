import Employee from "../models/Employee.js";

// Add Employee
export const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: "Employee Added Successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found." });
    return res.status(200).json({ success: true, message: "Employee updated successfully.", employee });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found." });
    return res.status(200).json({ success: true, message: "Employee deleted successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
