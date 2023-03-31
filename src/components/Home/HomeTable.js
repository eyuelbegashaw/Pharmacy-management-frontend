const HomeTable = ({drugs, handleEdit, selectedRow, drugsLoading}) => {
  return (
    <>
      <div className="horizontalTable table-container tableHome">
        <table className="table table-responsive border">
          <thead>
            <tr>
              <th>No</th>
              <th>Brand Name</th>
              <th>Generic Name</th>
              <th>In Stock</th>
            </tr>
          </thead>
          <tbody>
            {drugs.length > 0 &&
              drugs.map((drug, index) => (
                <tr
                  key={index}
                  onClick={() => handleEdit(drug._id)}
                  className={drug._id === selectedRow ? "selected-row" : ""}
                >
                  <td>{index + 1}</td>
                  <td>{drug.brand_name} </td>
                  <td>{drug.generic_name} </td>
                  <td>{drug.quantity} </td>
                </tr>
              ))}

            {drugs.length === 0 && drugsLoading && (
              <tr>
                <td colSpan="4" className="text-center">
                  <div className="spinner-border text-secondary my-2 me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            )}

            {drugs.length === 0 && !drugsLoading && (
              <tr>
                <td colSpan="4" className="text-center">
                  <span className="text-danger">No Data Available</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default HomeTable;
