const HomeTable = ({datas, handleEdit, selectedRow}) => {
  return (
    <>
      <div className="horizontalTable table-container">
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
            {datas.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center m-2 fs-5 text-danger">
                  No Data Available
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
