import {useNavigate} from "react-router-dom";
import {useGlobalState} from "../context/GlobalProvider";
import {useState, useEffect} from "react";

//APIs
import * as drugAPI from "../API/drugAPI";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";
import {ConvertDate} from "../util/date";

const FollowUp = () => {
  const navigate = useNavigate();
  const {user, expiredDrugs, loading, setLoading} = useGlobalState();
  const {expiredDrugsLoading} = loading;

  const [select, handleSelect] = useState("expired");
  const [days, setDays] = useState(0);
  const [filteredDrugs, setFilteredDrugs] = useState(expiredDrugs);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    setFilteredDrugs(expiredDrugs);
  }, [expiredDrugs]);

  const handleShow = async () => {
    try {
      if (Number(days) < 0 || !Number.isInteger(Number(days))) {
        toast.error("Please make sure all fields are filled in correctly");
      } else {
        setLoading(prevState => ({...prevState, expiredDrugsLoading: true}));
        if (select === "expired") {
          setFilteredDrugs(expiredDrugs);
        } else if (select === "expiringSoon") {
          const expiringSoon = await drugAPI.getExpiringSoonDrugs({days}, user.token);
          setFilteredDrugs(expiringSoon);
        } else if (select === "outOfStock") {
          const lowStockDrugs = await drugAPI.getLowStockDrug({quantity: days}, user.token);
          setFilteredDrugs(lowStockDrugs);
        }
      }

      setLoading(prevState => ({...prevState, expiredDrugsLoading: false}));
    } catch (error) {
      setLoading(prevState => ({...prevState, expiredDrugsLoading: false}));
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 theme text-white fs-4 text-center py-2 mb-2">
        Expired and Low Stock Drugs
      </div>

      <div className="d-sm-flex justify-content-around align-items-center ms-2">
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

        <div className="mt-2 d-md-flex ">
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
          <div className="d-flex" style={{width: 120}}>
            <div>
              <button className="btn theme text-white align-self-end" onClick={handleShow}>
                Show
              </button>
            </div>
            {filteredDrugs.length > 0 && expiredDrugsLoading && (
              <div className="spinner-border text-secondary ms-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
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
            {filteredDrugs.map((drug, index) => (
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

            {filteredDrugs.length === 0 && expiredDrugsLoading && (
              <tr>
                <td colSpan="8" className="text-center">
                  <div className="spinner-border text-secondary my-2 me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            )}

            {filteredDrugs.length == 0 && !expiredDrugsLoading && (
              <tr>
                <td colSpan="8" className="text-center">
                  <span className="text-danger">No data Available</span>
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
