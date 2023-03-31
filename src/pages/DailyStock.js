import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {useGlobalState} from "../context/GlobalProvider";

//API
import * as drugAPI from "../API/drugAPI";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";
import {ConvertDate} from "../util/date";
import {fixedTwoDigit} from "../util/twoDigit";

const DailyStock = () => {
  const navigate = useNavigate();

  const {user, allDrugs, suppliers, loading, setLoading} = useGlobalState();
  const {drugsLoading} = loading;

  const [filteredStock, setFilteredStock] = useState(allDrugs);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyDate, setDailyDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [selected, setSelected] = useState("daily");

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    setFilteredStock(allDrugs);
  }, [allDrugs]);

  const handleSubmit = async () => {
    try {
      setLoading(prevState => ({...prevState, drugsLoading: true}));
      if (selected === "daily") {
        const result = await drugAPI.getDailyStock({startDate: dailyDate, supplier}, user.token);
        setFilteredStock(result);
      } else if (selected === "range") {
        if ((startDate === "" && endDate !== "") || (startDate !== "" && endDate === "")) {
          toast.error("Both dates have to be filled or Both dates have to be empty");
        } else {
          const result = await drugAPI.getDailyStock({startDate, endDate, supplier}, user.token);
          setFilteredStock(result);
        }
      }
      setLoading(prevState => ({...prevState, drugsLoading: false}));
    } catch (error) {
      setLoading(prevState => ({...prevState, drugsLoading: false}));
      toast.error(errorMessage(error));
    }
  };

  const handleClear = () => {
    setFilteredStock(allDrugs);
    setSelected("daily");
    setDailyDate("");
    setStartDate("");
    setEndDate("");
    setSupplier("");
  };

  return (
    <div className="w-100">
      <div className="w-100 text-white fs-4 text-center py-2 theme">Stock Report</div>
      <div>
        <div className="d-md-flex justify-content-around ms-2">
          {selected === "daily" && (
            <div>
              <label htmlFor="daily">Select date</label> <br />
              <div>
                <input
                  type="date"
                  id="daily"
                  className="p-2 border rounded"
                  value={dailyDate}
                  onChange={e => setDailyDate(e.target.value)}
                />
              </div>
            </div>
          )}
          {selected === "range" && (
            <div>
              <label htmlFor="startDate">Date From</label> <br />
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="p-2 rounded border"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
          )}

          {selected === "range" && (
            <div>
              <label htmlFor="endDate">Date To</label> <br />
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="p-2 rounded border"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          )}

          <div style={{width: 100}}>
            <label htmlFor="option">Type</label>

            <select
              className="form-select"
              id="option"
              value={selected}
              onChange={e => setSelected(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="range">Range</option>
            </select>
          </div>

          <div style={{width: 150}}>
            <label htmlFor="supplier">Supplier</label>

            <select
              className="form-select"
              id="supplier"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
            >
              <option value="">All</option>
              {suppliers.map(supplier => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex threeButtons align-items-end" style={{width: 330}}>
            <div onClick={handleSubmit}>
              <button className="btn theme text-white">Show Stock</button>
            </div>
            <div onClick={handleClear}>
              <button className="ms-2 btn btn-danger">Clear</button>
            </div>
            <div className="ms-4" onClick={() => window.print()}>
              <button className="btn theme text-white">Print</button>
            </div>
            {filteredStock.length > 0 && drugsLoading && (
              <div className="spinner-border text-secondary mb-1 ms-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
        </div>
        <div className="horizontalTable table-container mt-1 w-100" id="divToPrint">
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>No</th>
                <th>Purchased Date</th>
                <th>Name</th>
                <th>Batch number</th>
                <th>Supplier</th>
                <th>Remaining Quantity</th>
                <th>Purchased Quantity</th>
                <th>Purchased Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((drug, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ConvertDate(drug.purchased_date)} </td>
                  <td>{drug.brand_name} </td>
                  <td>{drug.batch_number} </td>
                  <td>
                    {drug.supplier_id ? (
                      drug.supplier_id.name
                    ) : (
                      <span className="text-danger">DELETED</span>
                    )}
                  </td>
                  <td>{drug.quantity} </td>
                  <td>{drug.purchased_quantity} </td>
                  <td>{fixedTwoDigit(drug.purchased_price)} </td>
                </tr>
              ))}
              {filteredStock.length !== 0 && (
                <tr className="bottom">
                  <th colSpan="1"></th>
                  <th colSpan="2">
                    Gross Remaining Quantity ={" "}
                    {filteredStock.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </th>
                  <th colSpan="2">
                    Gross Purchased Quantity ={" "}
                    {filteredStock.reduce((acc, curr) => acc + curr.purchased_quantity, 0)}
                  </th>
                  <th colSpan="3">
                    Gross Purchased Price ={" "}
                    {fixedTwoDigit(
                      filteredStock.reduce(
                        (acc, curr) => acc + curr.purchased_quantity * curr.purchased_price,
                        0
                      )
                    )}
                  </th>
                </tr>
              )}

              {filteredStock.length === 0 && drugsLoading && (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="spinner-border text-secondary my-2 me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}

              {filteredStock.length === 0 && !drugsLoading && (
                <tr>
                  <td colSpan="8" className="text-center">
                    <span className="text-danger">No Data Available</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyStock;
