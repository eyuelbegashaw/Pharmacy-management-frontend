import {useState, useEffect, useContext} from "react";
import {userContext} from "../context/globalState";
import {useNavigate} from "react-router-dom";

//API
import * as drugAPI from "../API/drugAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {errorMessage} from "../util/error";
import {fixedTwoDigit} from "../util/twoDigit";

const RangeStock = () => {
  const navigate = useNavigate();
  const {user} = useContext(userContext);

  const [loading, setLoading] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [groupedDrugs, setGroupedDrugs] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await drugAPI.getAllDrug(user.token);
        setDrugs(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token, setDrugs]);

  useEffect(() => {
    const groupTransactionsByDate = () => {
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

      setGroupedDrugs(Object.entries(dailySummaries));
    };

    groupTransactionsByDate();
  }, [drugs]);

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
        setLoading(true);
        const response = await drugAPI.getDailyStock({startDate, endDate}, user.token);
        setDrugs(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      const response = await drugAPI.getAllDrug(user.token);
      setDrugs(response);
      setStartDate("");
      setEndDate("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="w-100">
      <ToastContainer />
      <div className="w-100 theme text-white fs-4 text-center py-2">Stock Report</div>
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
            {groupedDrugs.length > 0 && loading && (
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
                <th>Gross Remaining Quanitity</th>
                <th>Gross Purchased Quantity</th>
                <th>Gross Purchased Price</th>
              </tr>
            </thead>
            <tbody>
              {groupedDrugs.map(([date, summary]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{summary.GrossRemainingQuantity}</td>
                  <td>{summary.GrossPurchasedQuantity}</td>
                  <td>{fixedTwoDigit(summary.GrossPurchasedPrice)}</td>
                </tr>
              ))}

              {groupedDrugs.length === 0 && loading && (
                <tr>
                  <td colSpan="4" className="text-center">
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

export default RangeStock;
