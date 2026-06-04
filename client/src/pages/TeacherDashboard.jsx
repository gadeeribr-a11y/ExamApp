function TeacherDashboard() {
  return (
    <div className="container mt-4">
      <h1>Teacher Dashboard</h1>

      <button className="btn btn-primary mb-3">
        Add Exam
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>React Basics</td>
            <td>Published</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TeacherDashboard;