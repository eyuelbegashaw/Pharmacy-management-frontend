import {ConvertDate} from "../../util/date";
const DrugTable = ({drugs, handleDelete, handleEdit, selectedRow, loading}) => {
  return (
    <>
      <div className="table-container ms-1">
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>No</th>
              <th>brand name</th>
              <th>generic name</th>
              <th>batch number</th>
              <th>purchased price</th>
              <th>selling price</th>
              <th>production date</th>
              <th>expiration date</th>
              <th>purchased date</th>
              <th>Stock Quantity</th>
              <th>Purchased Quantity </th>
              <th>Low Stock</th>
              <th>type</th>
              <th>location</th>
              <th>measurement size</th>
              <th>Category</th>
              <th>Supplier</th>

              <th>Delete</th>
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
                  <td>{drug.batch_number} </td>
                  <td>{drug.purchased_price} </td>
                  <td>{drug.selling_price} </td>
                  <td>{ConvertDate(drug.production_date)} </td>
                  <td>{ConvertDate(drug.expiry_date)} </td>
                  <td>{ConvertDate(drug.purchased_date)} </td>
                  <td>{drug.quantity} </td>
                  <td>{drug.purchased_quantity} </td>
                  <td>{drug.lowStock} </td>
                  <td>{drug.type} </td>
                  <td>{drug.location} </td>
                  <td>{drug.measurement_size} </td>
                  <td>
                    {drug.category_id ? (
                      drug.category_id.name
                    ) : (
                      <span className="text-danger">DELETED</span>
                    )}
                  </td>
                  <td>
                    {drug.supplier_id ? (
                      drug.supplier_id.name
                    ) : (
                      <span className="text-danger">DELETED</span>
                    )}
                  </td>

                  <td>
                    <button className="border-0" onClick={() => handleDelete(drug._id)}>
                      <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}

            {drugs.length === 0 && loading && (
              <tr>
                <td colSpan="18" className="text-center">
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

export default DrugTable;
