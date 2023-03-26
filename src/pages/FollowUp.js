import {useNavigate} from "react-router-dom";
import {userContext} from "../context/globalState";
import {useState, useEffect, useContext} from "react";

//APIs
import * as drugAPI from "../API/drugAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";
import {ConvertDate} from "../util/date";

const FollowUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [select, handleSelect] = useState("expired");
  const [days, setDays] = useState(0);
  const [drugs, setDrugs] = useState([]);
  const {user} = useContext(userContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reponse = await drugAPI.getExpiredDrug(user.token);
        setLoading(false);
        setDrugs(reponse);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleShow = async () => {
    try {
      if (select === "expired") {
        const expired = await drugAPI.getExpiredDrug(user.token);
        setDrugs(expired);
      } else if (select === "expiringSoon") {
        const expiringSoon = await drugAPI.getExpiringSoonDrugs({days}, user.token);
        setDrugs(expiringSoon);
      } else if (select === "outOfStock") {
        const lowStockDrugs = await drugAPI.getLowStockDrug({quantity: days}, user.token);
        setDrugs(lowStockDrugs);
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 theme text-white fs-4 text-center py-2 mb-2">
        Expired and Low Stock Drugs
      </div>
      <ToastContainer />

      <div className="d-sm-flex justify-content-around  align-items-center ms-1">
        <div className="mb-3">
          <label htmlFor="expiredItems"></label>

          <select
            className="form-select"
            style={{width: 250}}
            id="supplier"
            name="expiredItems"
            value={select}
            onChange={e => {
              handleSelect(e.target.value);
              if (e.target.value === "expired") {
                setDays(0);
              }
            }}
          >
            <option value="expired">Expired</option>
            <option value="expiringSoon">Expiring soon</option>
            <option value="outOfStock">Low Stock</option>
          </select>
        </div>

        <div className="ms-2 mt-2 d-md-flex ">
          <div className="mt-sm-1">
            {select === "outOfStock" ? (
              <label htmlFor="expiringDays">Maximum Quantity : </label>
            ) : (
              <label htmlFor="expiringDays">Expiration Limit : </label>
            )}
          </div>
          <div className="mb-2">
            <input
              className="form-control me-2 "
              id="expiringDays"
              type="number"
              name="expiringDays"
              readOnly={select === "expired"}
              value={days}
              style={{width: 250}}
              onChange={e => setDays(e.target.value)}
            />
          </div>
          <div>
            <button className="btn theme text-white align-self-end" onClick={handleShow}>
              Show
            </button>
          </div>
        </div>
      </div>

      <div className="horizontalTable m-sm-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>brand name</th>
              <th>batch number</th>
              <th>purchased price</th>
              <th>selling price</th>
              <th>expiration date</th>
              <th>purchased date</th>
              <th>quantity</th>
              <th>location</th>
            </tr>
          </thead>
          <tbody>
            {drugs.map((drug, index) => (
              <tr key={index}>
                <td>{drug.brand_name} </td>
                <td>{drug.batch_number} </td>
                <td>{drug.purchased_price} </td>
                <td>{drug.selling_price} </td>

                <td>{ConvertDate(drug.expiry_date)} </td>
                <td>{ConvertDate(drug.purchased_date)} </td>
                <td>{drug.quantity} </td>
                <td>{drug.location} </td>
              </tr>
            ))}

            {drugs.length === 0 && loading && (
              <tr>
                <td colSpan="8" className="text-center">
                  <div class="spinner-border text-secondary my-2 me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUp;
