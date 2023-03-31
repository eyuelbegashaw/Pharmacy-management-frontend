const UserTable = ({users, handleDelete, handleEdit, usersLoading}) => {
  return (
    <>
      <div className="horizontalTable">
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Name</th>
              <th>Admin</th>
              <th>Gender</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Email</th>

              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name} </td>
                <td>{user.isAdmin ? "True" : "False"} </td>
                <td>{user.gender} </td>
                <td>{user.phone_number} </td>
                <td>{user.status} </td>
                <td>{user.email} </td>

                <td>
                  <button className="border-0" onClick={() => handleEdit(user._id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
                {user._id !== "641e1b2cead8aac02d79092e" && (
                  <td>
                    <button className="border-0" onClick={() => handleDelete(user._id)}>
                      <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {users.length === 0 && usersLoading && (
              <tr>
                <td colSpan="8" className="text-center">
                  <div class="spinner-border text-secondary my-2 me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            )}

            {users.length === 0 && !usersLoading && (
              <tr>
                <td colSpan="8" className="text-center">
                  <span class="text-danger">No Data Available</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
