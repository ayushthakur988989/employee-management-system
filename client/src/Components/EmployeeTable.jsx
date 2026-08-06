function EmployeeTable({ employees, deleteEmployee, selectEmployee }) {
  return (
    <div className="card shadow">
      <div className="card-body p-0 p-md-3">

        <div className="table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>₹{emp.salary}</td>

                <td className="text-nowrap">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => selectEmployee(emp)}
                  >
                    Edit
                  </button>

                  <button
  className="btn btn-danger btn-sm"
  onClick={() => deleteEmployee(emp._id)}
>
  Delete
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

      </div>
    </div>
  );
}

export default EmployeeTable;
