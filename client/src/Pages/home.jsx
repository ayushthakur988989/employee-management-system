import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";
import EmployeeTable from "../Components/EmployeeTable";
import api from "../utils/api";

function Home() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/", { replace: true });
      return;
    }
    const loadEmployees = async () => {
      try {
        const { data } = await api.get("/employees");
        setEmployees(data.employees);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/", { replace: true });
          return;
        }
        setError(requestError.response?.data?.message || "Unable to load employees.");
      }
    };
    loadEmployees();
  }, [navigate]);

  const addEmployee = async (employee) => {
  const confirmAdd = window.confirm(
    "Do you want to add this employee?"
  );

  if (confirmAdd) {
    try {
      const { data } = await api.post("/employees", employee);
      setEmployees((current) => [...current, data.employee]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add employee.");
    }
  }
};

  // Delete Employee
  const deleteEmployee = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (confirmDelete) {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((current) => current.filter((emp) => emp._id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete employee.");
    }
  }
};

  // Select Employee for Edit
  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  // Update Employee
  const editEmployee = async (updatedEmployee) => {
  const confirmUpdate = window.confirm(
    "Do you want to update this employee?"
  );

  if (confirmUpdate) {
    try {
      const { data } = await api.put(`/employees/${updatedEmployee._id}`, updatedEmployee);
      setEmployees((current) => current.map((emp) => emp._id === data.employee._id ? data.employee : emp));
      setSelectedEmployee(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update employee.");
    }
  }
};

  return (
    <div className="container py-3 py-md-5">

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <h2 className="fw-bold mb-0 home-title">Employee Management System</h2>
        <button className="btn btn-outline-danger" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>Logout</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <EmployeeForm
        key={selectedEmployee?._id || "new"}
        addEmployee={addEmployee}
        editEmployee={editEmployee}
        selectedEmployee={selectedEmployee}
      />

      <EmployeeTable
        employees={employees}
        deleteEmployee={deleteEmployee}
        selectEmployee={selectEmployee}
      />

    </div>
  );
}

export default Home;
