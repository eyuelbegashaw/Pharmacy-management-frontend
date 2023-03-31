import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {useGlobalState} from "../context/GlobalProvider";

//API
import * as transactionAPI from "../API/transactionAPI";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";
import {ConvertDate} from "../util/date";
import {fixedTwoDigit} from "../util/twoDigit";

const DailyTransaction = () => {
  const navigate = useNavigate();
  const {user, users, transactions, setTransactions, loading, setLoading} = useGlobalState();
  const {transactionsLoading} = loading;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyDate, setDailyDate] = useState("");
  const [saleBy, setSaleBy] = useState("");
  const [selected, setSelected] = useState("daily");
  const [filteredTransaction, setFilteredTransaction] = useState(transactions);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    setFilteredTransaction(transactions);
  }, [transactions]);

  const handleSubmit = async () => {
    try {
      setLoading(prevState => ({...prevState, transactionsLoading: true}));
      if (selected === "daily") {
        const result = await transactionAPI.getDailyTransaction(
          {startDate: dailyDate, saleBy},
          user.token
        );
        setFilteredTransaction(result);
      } else if (selected === "range") {
        if ((startDate === "" && endDate !== "") || (startDate !== "" && endDate === "")) {
          toast.error("Both dates have to be filled or Both dates have to be empty");
        } else {
          const result = await transactionAPI.getDailyTransaction(
            {startDate, endDate, saleBy},
            user.token
          );
          setFilteredTransaction(result);
        }
      }
      setLoading(prevState => ({...prevState, transactionsLoading: false}));
    } catch (error) {
      setLoading(prevState => ({...prevState, transactionsLoading: false}));
      toast.error(errorMessage(error));
    }
  };

  const handleClear = () => {
    setFilteredTransaction(transactions);
    setSelected("daily");
    setDailyDate("");
    setStartDate("");
    setEndDate("");
    setSaleBy("");
  };

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await transactionAPI.deleteTransaction(id, user.token);
        setTransactions(transactions.filter(value => value._id !== id));
        toast.success("Transaction Deleted Successfully");
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 text-white fs-4 text-center py-2 theme">Transaction Report</div>
      <div>
        {user.isAdmin && (
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
              <label htmlFor="saleBy">Sale by</label>

              <select
                className="form-select"
                id="saleBy"
                value={saleBy}
                onChange={e => setSaleBy(e.target.value)}
              >
                <option value="">All</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex align-items-end threeButtons" style={{width: 330}}>
              <div onClick={handleSubmit}>
                <button className="btn theme text-white">Show Sales</button>
              </div>
              <div onClick={handleClear}>
                <button className="ms-2 btn btn-danger">Clear</button>
              </div>
              <div className="ms-4" onClick={() => window.print()}>
                <button className="btn theme text-white">Print</button>
              </div>
              {transactions.length > 0 && transactionsLoading && (
                <div className="spinner-border text-secondary mb-1 ms-1" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="horizontalTable table-container mt-1 w-100" id="divToPrint">
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <th>No</th>
                <th>Date</th>
                <th>Name</th>
                <th>Batch number</th>
                <th>Sales by</th>
                {user.isAdmin && <th>Purchased Price</th>}
                <th>Quantity</th>
                <th>Sale Price</th>
                <th>Total price</th>
                {user.isAdmin && <th>Profit</th>}
                {user.isAdmin && <th className="deleteButton">Delete</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransaction.map((transaction, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ConvertDate(transaction.date)} </td>
                  <td>{transaction.brand_name} </td>
                  <td>{transaction.batch_number} </td>
                  <td>
                    {transaction.sale_by ? (
                      transaction.sale_by.name
                    ) : (
                      <span className="text-danger">DELETED</span>
                    )}
                  </td>
                  {user.isAdmin && <td>{fixedTwoDigit(transaction.purchased_price)}</td>}
                  <td>{transaction.quantity} </td>
                  <td>{fixedTwoDigit(transaction.price)} </td>
                  <td>{fixedTwoDigit(transaction.total_price)} </td>
                  {user.isAdmin && <td>{fixedTwoDigit(transaction.profit)} </td>}
                  {user.isAdmin && (
                    <td>
                      <button
                        className="border-0 deleteButton"
                        onClick={() => handleDelete(transaction._id)}
                      >
                        <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {filteredTransaction.length !== 0 && (
                <tr className="bottom">
                  <th colSpan="1"></th>
                  <th colSpan={user.isAdmin ? "2" : "3"}>
                    Gross Sold Quantity ={" "}
                    {filteredTransaction.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </th>
                  {user.isAdmin && (
                    <th colSpan="2">
                      Gross Buying Price ={" "}
                      {fixedTwoDigit(
                        filteredTransaction.reduce(
                          (acc, curr) => acc + curr.quantity * curr.purchased_price,
                          0
                        )
                      )}
                    </th>
                  )}

                  <th colSpan={user.isAdmin ? "2" : "8"}>
                    Gross Sold Price ={" "}
                    {fixedTwoDigit(
                      filteredTransaction.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
                    )}
                  </th>
                  {user.isAdmin && (
                    <th colSpan="4">
                      Gross Profit ={" "}
                      {fixedTwoDigit(
                        filteredTransaction.reduce((acc, curr) => acc + curr.profit, 0)
                      )}
                    </th>
                  )}
                </tr>
              )}
              {filteredTransaction.length === 0 && transactionsLoading && (
                <tr>
                  <td colSpan={user.isAdmin ? "11" : "8"} className="text-center">
                    <div className="spinner-border text-secondary my-2 me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}

              {filteredTransaction.length === 0 && !transactionsLoading && (
                <tr>
                  <td colSpan={user.isAdmin ? "11" : "8"} className="text-center">
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

export default DailyTransaction;
