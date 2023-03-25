import {useState, useEffect, useContext} from "react";
import {userContext} from "../context/globalState";
import {useNavigate} from "react-router-dom";

//API
import * as drugAPI from "../API/drugAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

import {errorMessage} from "../util/error";

const RangeStock = () => {
  const navigate = useNavigate();
  const {user} = useContext(userContext);

  const [datas, setDatas] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await drugAPI.getDrug(user.token);
        groupTransactionsByDate(response);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, []);

  const ConvertDate = input => {
    let x = Date.parse(input);
    if (!isNaN(x)) {
      let date = new Date(input);
      let result = new Date(date.getTime()).toISOString().substring(0, 10);
      return result;
    } else if (input === "") return "";
  };

  const handleSubmit = async () => {
    if (startDate === "" || endDate === "") {
      toast.error("Empty fields");
    } else {
      try {
        const result = await drugAPI.getDailyStock({startDate, endDate}, user.token);
        groupTransactionsByDate(result);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleClear = async () => {
    const response = await drugAPI.getDrug(user.token);
    groupTransactionsByDate(response);
    setStartDate("");
    setEndDate("");
  };

  const groupTransactionsByDate = drugs => {
    const dailySummaries = {};

    drugs.forEach(drug => {
      const date = ConvertDate(drug.purchased_date);
      if (!dailySummaries[date]) {
        dailySummaries[date] = {
          GrossRemainingQuantity: 0,
          GrossPurchasedQuantity: 0,
          GrossPurchasedPrice: 0,
        };
      }

      dailySummaries[date].GrossRemainingQuantity += drug.quantity;
      dailySummaries[date].GrossPurchasedQuantity += drug.purchased_quantity;
      dailySummaries[date].GrossPurchasedPrice += drug.purchased_price * drug.purchased_quantity;
    });

    setDatas(dailySummaries);
  };

  return (
    <div className="w-100">
      <ToastContainer />
      <div className="w-100 theme text-white fs-4 text-center py-2">Stock Report</div>
      <div>
        <div className="d-md-flex justify-content-around">
          <div>
            <label for="startDate">Date From</label> <br />
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              className="p-2 rounded border border-primary"
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label for="endDate">Date To</label> <br />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              className="p-2 rounded border border-primary"
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className="d-flex align-self-end">
            <div className="me-2">
              <button className="btn theme text-white" onClick={handleSubmit}>
                Show Stock
              </button>
            </div>
            <div>
              <button className="btn btn-danger" onClick={handleClear}>
                Clear
              </button>
            </div>
            <div className="ms-4 align-self-end" onClick={() => window.print()}>
              <button className="btn theme text-white">Print</button>
            </div>
          </div>
        </div>
        <div className="horizontalTable table-container mt-1 w-100" id="divToPrint">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Gross Remaining Quanitity</th>
                <th>Gross Purchased Quantity</th>
                <th>Gross Purchased Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(datas).map(([date, summary]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{summary.GrossRemainingQuantity}</td>
                  <td>{summary.GrossPurchasedQuantity}</td>
                  <td>{summary.GrossPurchasedPrice}</td>
                </tr>
              ))}

              {Object.entries(datas).length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center m-2 fs-5 text-danger">
                    No Data Available
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

export default RangeStock;
