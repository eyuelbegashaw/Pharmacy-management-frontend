import {useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {userContext} from "../context/globalState";

//API
import * as drugAPI from "../API/drugAPI";
import * as supplierAPI from "../API/supplierAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";
import {ConvertDate} from "../util/date";
import {fixedTwoDigit} from "../util/twoDigit";

const DailyStock = () => {
  const navigate = useNavigate();
  const {user} = useContext(userContext);

  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await supplierAPI.getSupplier(user.token);
        const response = await drugAPI.getDrug(user.token);
        setDatas(response);
        setSuppliers(result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selected === "daily") {
        const result = await drugAPI.getDailyStock({startDate: dailyDate, supplier}, user.token);
        setDatas(result);
      } else if (selected === "range") {
        if ((startDate === "" && endDate !== "") || (startDate !== "" && endDate === "")) {
          toast.error("Both dates have to be filled or Both dates have to be empty");
        } else {
          const result = await drugAPI.getDailyStock({startDate, endDate, supplier}, user.token);
          setDatas(result);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(errorMessage(error));
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      const response = await drugAPI.getDrug(user.token);
      setDatas(response);
      setSelected("daily");
      setDailyDate("");
      setStartDate("");
      setEndDate("");
      setSupplier("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="w-100">
      <ToastContainer />
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

          <div className="d-flex threeButtons" style={{width: 330}}>
            <div className="align-self-end" onClick={handleSubmit}>
              <button className="btn theme text-white">Show Stock</button>
            </div>
            <div className="align-self-end" onClick={handleClear}>
              <button className="ms-2 btn btn-danger">Clear</button>
            </div>
            <div className="ms-4 align-self-end" onClick={() => window.print()}>
              <button className="btn theme text-white">Print</button>
            </div>
            {datas.length > 0 && loading && (
              <div className="spinner-border text-secondary mb-1 ms-1" role="status">
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
              {datas.length !== 0 &&
                datas.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ConvertDate(data.purchased_date)} </td>
                    <td>{data.brand_name} </td>
                    <td>{data.batch_number} </td>
                    <td>
                      {data.supplier_id ? (
                        data.supplier_id.name
                      ) : (
                        <span className="text-danger">DELETED</span>
                      )}
                    </td>
                    <td>{data.quantity} </td>
                    <td>{data.purchased_quantity} </td>
                    <td>{fixedTwoDigit(data.purchased_price)} </td>
                  </tr>
                ))}
              {datas.length !== 0 && (
                <tr className="bottom">
                  <th colSpan="1"></th>
                  <th colSpan="2">
                    Gross Remaining Quantity = {datas.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </th>
                  <th colSpan="2">
                    Gross Purchased Quantity ={" "}
                    {datas.reduce((acc, curr) => acc + curr.purchased_quantity, 0)}
                  </th>
                  <th colSpan="3">
                    Gross Purchased Price ={" "}
                    {fixedTwoDigit(
                      datas.reduce(
                        (acc, curr) => acc + curr.purchased_quantity * curr.purchased_price,
                        0
                      )
                    )}
                  </th>
                </tr>
              )}

              {datas.length === 0 && loading && (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="spinner-border text-secondary my-2 me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
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
