const HomeTable = ({datas, handleEdit, selectedRow, loading}) => {
  return (
    <>
      <div className="horizontalTable table-container tableHome">
        <table className="table table-responsive border">
          <thead>
            <tr>
              <th>No</th>
              <th>Brand Name</th>
              <th>In Stock</th>
            </tr>
          </thead>
          <tbody>
            {datas.length > 0 &&
              datas.map((data, index) => (
                <tr
                  key={index}
                  onClick={() => handleEdit(data._id)}
                  className={data._id === selectedRow ? "selected-row" : ""}
                >
                  <td>{index + 1}</td>
                  <td>{data.brand_name} </td>
                  <td>{data.quantity} </td>
                </tr>
              ))}

            {datas.length === 0 && loading && (
              <tr>
                <td colSpan="3" className="text-center">
                  <div className="spinner-border text-secondary my-2 me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
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

export default HomeTable;
