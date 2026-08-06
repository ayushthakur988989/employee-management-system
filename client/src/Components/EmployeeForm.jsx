import { useState } from "react";

function EmployeeForm({ addEmployee, editEmployee, selectedEmployee }) {
  const [employee, setEmployee] = useState(selectedEmployee || {
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.email ||
      !employee.department ||
      !employee.salary
    ) {
      alert("Please fill all fields");
      return;
    }

    if (selectedEmployee) {
      editEmployee(employee);
    } else {
      addEmployee(employee);
    }

    setEmployee({
      name: "",
      email: "",
      department: "",
      salary: "",
    });
  };

  return (
    <div className="card shadow p-3 p-md-4 mb-4">
      <h4 className="mb-3">
        {selectedEmployee ? "Edit Employee" : "Add Employee"}
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="row">

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Employee Name"
              name="name"
              value={employee.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={employee.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Department"
              name="department"
              value={employee.department}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Salary"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
            />
          </div>

        </div>

        <button className="btn btn-primary w-100">
          {selectedEmployee ? "Update Employee" : "Add Employee"}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
