const SupplierTable = ({suppliers, handleDelete, handleEdit, suppliersLoading}) => {
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
          {suppliers.map((supplier, index) => (
            <tr key={index}>
              <td>{supplier.name} </td>
              <td>{supplier.phone_number} </td>
              <td>
                <a
                  className="links"
                  href={`${supplier.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Licence
                </a>
              </td>

              <td>
                <button className="border-0" onClick={() => handleEdit(supplier._id)}>
                  <i className="fas fa-edit"></i>
                </button>
              </td>
              <td>
                <button className="border-0" onClick={() => handleDelete(supplier._id)}>
                  <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          ))}

          {suppliers.length === 0 && suppliersLoading && (
            <tr>
              <td colSpan="5" className="text-center">
                <div className="spinner-border text-secondary my-2 me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
          )}

          {suppliers.length === 0 && !suppliersLoading && (
            <tr>
              <td colSpan="5" className="text-center">
                <span className="text-danger">No Data Available</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default SupplierTable;
