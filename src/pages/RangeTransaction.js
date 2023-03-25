import {useState, useEffect, useContext} from "react";
import {userContext} from "../context/globalState";

//API
import * as transactionAPI from "../API/transactionAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

import {errorMessage} from "../util/error";

const RangeTransaction = () => {
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
        const response = await transactionAPI.getTransaction(user.token);
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
      toast.error("Both dates are required");
    } else {
      try {
        const result = await transactionAPI.getDailyTransaction({startDate, endDate}, user.token);
        console.log(result);
        groupTransactionsByDate(result);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleClear = async () => {
    const response = await transactionAPI.getTransaction(user.token);
    groupTransactionsByDate(response);
    setStartDate("");
    setEndDate("");
  };

  const groupTransactionsByDate = transactions => {
    const dailySummaries = {};

    transactions.forEach(transaction => {
      const date = ConvertDate(transaction.date);
      if (!dailySummaries[date]) {
        dailySummaries[date] = {
          GrossProfit: 0,
          GrossQuantity: 0,
          GrossSoldPrice: 0,
          GrossBuyingPrice: 0,
        };
      }

      dailySummaries[date].GrossProfit += transaction.profit;
      dailySummaries[date].GrossQuantity += transaction.quantity;
      dailySummaries[date].GrossSoldPrice += transaction.price * transaction.quantity;
      dailySummaries[date].GrossBuyingPrice += transaction.purchased_price * transaction.quantity;
    });

    setDatas(dailySummaries);
  };

  return (
    <div className="w-100">
      <ToastContainer />
      <div className="w-100 theme text-white fs-4 text-center py-2">Transaction Report</div>
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
                Show Sales
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
                <th>Gross Buying Price</th>
                <th>Gross Quantity</th>
                <th>Gross Sold Price</th>
                <th>Gross Profit</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(datas).map(([date, summary]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{summary.GrossBuyingPrice}</td>
                  <td>{summary.GrossQuantity}</td>
                  <td>{summary.GrossSoldPrice}</td>
                  <td>{summary.GrossProfit}</td>
                </tr>
              ))}

              {Object.entries(datas).length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center m-2 fs-5 text-danger">
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

export default RangeTransaction;
