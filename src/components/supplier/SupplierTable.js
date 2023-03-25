const SupplierTable = ({datas, handleDelete, handleEdit}) => {
  return (
    <>
      <table className="table table-striped table-responsive">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone number</th>
            <th>Image</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data, index) => (
            <tr key={index}>
              <td>{data.name} </td>
              <td>{data.phone_number} </td>
              <td>
                <a className="links" href={`${data.image}`} target="_blank">
                  Licence
                </a>
              </td>

              <td>
                <button className="border-0" onClick={() => handleEdit(data._id)}>
                  <i className="fas fa-edit"></i>
                </button>
              </td>
              <td>
                <button className="border-0" onClick={() => handleDelete(data._id)}>
                  <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          ))}

          {datas.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center m-2 fs-5 text-danger">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default SupplierTable;
