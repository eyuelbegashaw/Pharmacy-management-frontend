const UserTable = ({datas, handleDelete, handleEdit, loading}) => {
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
            {datas.map((data, index) => (
              <tr key={index}>
                <td>{data.name} </td>
                <td>{data.isAdmin ? "True" : "False"} </td>
                <td>{data.gender} </td>
                <td>{data.phone_number} </td>
                <td>{data.status} </td>
                <td>{data.email} </td>

                <td>
                  <button className="border-0" onClick={() => handleEdit(data._id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
                {data._id !== "641e1b2cead8aac02d79092e" && (
                  <td>
                    <button className="border-0" onClick={() => handleDelete(data._id)}>
                      <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {datas.length === 0 && loading && (
              <tr>
                <td colSpan="8" className="text-center">
                  <div class="spinner-border text-secondary my-2 me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
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
