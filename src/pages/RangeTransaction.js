import {useState, useEffect} from "react";
import {useGlobalState} from "../context/GlobalProvider";

//API
import * as transactionAPI from "../API/transactionAPI";

//Toast component
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

//Utils
import {errorMessage} from "../util/error";
import {ConvertDate} from "../util/date";
import {fixedTwoDigit} from "../util/twoDigit";

const RangeTransaction = () => {
  const navigate = useNavigate();
  const {user, transactions, loading, setLoading} = useGlobalState();
  const {transactionsLoading} = loading;

  const [filteredTransaction, setFilteredTransaction] = useState(transactions);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    setFilteredTransaction(transactions);
  }, [transactions]);

  useEffect(() => {
    const groupTransactionsByDate = () => {
      const dailySummaries = {};

      filteredTransaction.forEach(transaction => {
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

      setGroupedTransactions(Object.entries(dailySummaries));
    };

    groupTransactionsByDate();
  }, [filteredTransaction]);

  const handleSubmit = async () => {
    if (startDate === "" || endDate === "") {
      toast.error("Both dates are required");
    } else {
      try {
        setLoading(prevState => ({...prevState, transactionsLoading: true}));
        const response = await transactionAPI.getDailyTransaction({startDate, endDate}, user.token);
        setFilteredTransaction(response);
        setLoading(prevState => ({...prevState, transactionsLoading: false}));
      } catch (error) {
        setLoading(prevState => ({...prevState, transactionsLoading: false}));
        toast.error(errorMessage(error));
      }
    }
  };

  const handleClear = () => {
    setFilteredTransaction(transactions);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="w-100">
      <div className="w-100 theme text-white fs-4 text-center py-2">Transaction Report</div>
      <div>
        <div className="d-md-flex justify-content-around ms-2">
          <div>
            <label htmlFor="startDate">Date From</label> <br />
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              className="p-2 rounded border"
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="endDate">Date To</label> <br />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              className="p-2 rounded border"
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className="d-flex align-self-end threeButtons" style={{width: 330}}>
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
            {groupedTransactions.length > 0 && transactionsLoading && (
              <div className="spinner-border text-secondary mb-1 ms-1" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
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
              {groupedTransactions.map(([date, summary]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{fixedTwoDigit(summary.GrossBuyingPrice)}</td>
                  <td>{summary.GrossQuantity}</td>
                  <td>{fixedTwoDigit(summary.GrossSoldPrice)}</td>
                  <td>{fixedTwoDigit(summary.GrossProfit)}</td>
                </tr>
              ))}

              {groupedTransactions.length === 0 && transactionsLoading && (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div className="spinner-border text-secondary my-2 me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}

              {groupedTransactions.length === 0 && !transactionsLoading && (
                <tr>
                  <td colSpan="5" className="text-center">
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

export default RangeTransaction;
