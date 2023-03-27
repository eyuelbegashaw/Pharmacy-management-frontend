import {useNavigate} from "react-router-dom";
import {userContext} from "../context/globalState";
import {useEffect, useState, useContext} from "react";

//Home components
import Receipt from "./Receipt";
import HomeForm from "../components/Home/HomeForm";
import HomeTable from "../components/Home/HomeTable";
import Notification from "../components/Home/Notification";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

import {errorMessage} from "../util/error";
import {fixedTwoDigit} from "../util/twoDigit";

//APIs
import * as drugAPI from "../API/drugAPI";
import * as categoryAPI from "../API/categoryAPI";
import * as transactionAPI from "../API/transactionAPI";
import * as NotificationAPI from "../API/notificationAPI";

const Home = () => {
  const navigate = useNavigate();

  const {user} = useContext(userContext);
  const [inputs, setInputs] = useState({
    _id: "",
    brand_name: "",
    generic_name: "",
    category_id: "",
    supplier_id: "",
    batch_number: "",
    purchased_price: 0,
    selling_price: 0,
    production_date: "",
    expiry_date: "",
    purchased_date: "",
    quantity: 0,
    type: "",
    location: "",
    remark: "",
    measurement_size: "",
  });

  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [print, setPrint] = useState(false);

  const [drugs, setDrugs] = useState([]);
  const [fetchedDrugs, setFetchedDrugs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categories = await categoryAPI.getCategory(user.token);
        const drugs = await drugAPI.getDrug(user.token);
        setDrugs(drugs);
        setFetchedDrugs(drugs);
        setCategories(categories);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await NotificationAPI.getNotification(user.token);
        setNotifications(response);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [drugs, user.token]);

  useEffect(() => {
    const handleSearch = () => {
      let filteredData = fetchedDrugs;
      if (searchTerm.trim() !== "") {
        if (category !== "all") {
          filteredData = filteredData.filter(
            item =>
              item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (category === "" || item.category_id.name === category)
          );
        } else if (category === "all") {
          filteredData = fetchedDrugs.filter(item => {
            return item.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
          });
        }
      } else if (category !== "" && category !== "all") {
        filteredData = filteredData.filter(
          item => item.category_id && item.category_id.name === category
        );
      }
      setDrugs(filteredData);
    };

    handleSearch();
  }, [searchTerm, category, fetchedDrugs]);

  const handleChange = e => {
    const name = e.target.name;
    setInputs({...inputs, [name]: Number(e.target.value)});
  };

  const calculateProfit = () => {
    let profit = inputs.selling_price - inputs.purchased_price;
    let totalProfit = inputs.quantity * profit;
    let category = inputs.category_id ? inputs.category_id.name.toLowerCase() : null;
    if (category && category === "cosmotics") {
      let totalSellingPrice = inputs.selling_price * inputs.quantity;
      let TOT = totalSellingPrice * 0.02;
      totalProfit -= TOT;
    }
    return totalProfit;
  };

  const handlePrint = () => {
    if (transaction.length !== 0) {
      setPrint(true);
    } else {
      toast.error("Empty transaction");
    }
  };

  const handleSubmit = async () => {
    if (inputs.selling_price <= 0 || inputs.quantity <= 0 || !Number.isInteger(inputs.quantity)) {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      const existingPurchase = transaction.find(p => p.drug_id === inputs._id);
      if (existingPurchase) {
        toast.error(
          "Duplicate drug detected in transaction. Please adjust quantity instead of creating a new entry"
        );
      } else {
        const purchase = {
          date: new Date(),
          brand_name: inputs.brand_name,
          batch_number: inputs.batch_number,
          expiry_date: inputs.expiry_date,
          measurement_size: inputs.measurement_size,
          purchased_price: inputs.purchased_price,
          quantity: inputs.quantity,
          price: inputs.selling_price,
          total_price: inputs.selling_price * inputs.quantity,
          sale_by: user._id,
          drug_id: inputs._id,
          profit: calculateProfit(),
        };

        setTransaction([...transaction, purchase]);
      }
    }
  };

  const handleClear = () => {
    setInputs({
      _id: "",
      brand_name: "",
      generic_name: "",
      category_id: "",
      supplier_id: "",
      batch_number: "",
      purchased_price: 0,
      selling_price: 0,
      production_date: "",
      expiry_date: "",
      purchased_date: "",
      quantity: 0,
      type: "",
      location: "",
      remark: "",
      measurement_size: "",
    });
    setSelectedRow("");
  };

  const handleSell = async () => {
    if (transaction.length !== 0) {
      try {
        if (transaction.length !== 0) {
          setLoading(true);
          await transactionAPI.createTransaction(transaction, user.token);
          toast.success("Transaction added successfully");
          const drugs = await drugAPI.getDrug(user.token);
          setDrugs(drugs);
          setFetchedDrugs(drugs);
          setLoading(false);
        }
      } catch (error) {
        toast.error(errorMessage(error));
      }
    } else {
      toast.error("Empty transaction");
    }
  };

  const handleEdit = id => {
    setSelectedRow(id);
    let target = drugs.find(value => value._id === id);
    let obj = {
      ...target,
      category_id: target.category_id ? target.category_id : "",
      supplier_id: target.supplier_id ? target.supplier_id : "",
    };

    setInputs({...obj, quantity: 1});
  };

  return (
    <>
      {!print && (
        <div className="w-100">
          <ToastContainer />
          <div className="w-100 text-white fs-4 text-center py-2 mb-2 theme d-flex justify-content-around ">
            <div>BENET PHARMACY</div>
            <Notification notifications={notifications} setNotifications={setNotifications} />
          </div>

          <div className="d-md-flex w-100">
            <div className="justify-content-around m-3">
              <div className="m-2">
                <div>
                  <select
                    className="form-select select"
                    id="category"
                    name="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="all">All</option>
                    {categories.map(category => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    className="searchTerm w-100"
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="What are you looking for?"
                  />
                </div>

                <div>
                  <HomeTable
                    datas={drugs}
                    handleEdit={handleEdit}
                    selectedRow={selectedRow}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
            <div className="flex-fill">
              <HomeForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleClear={handleClear}
                inputs={inputs}
              />

              <div className="mt-2 p-1">
                <div className="border border-secondary">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Price</th>
                        <th scope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.map((data, index) => (
                        <tr key={index}>
                          <th>{index + 1}</th>
                          <td>{data.brand_name}</td>
                          <td>{data.quantity}</td>
                          <td>{fixedTwoDigit(data.price)}</td>
                          <td>{fixedTwoDigit(data.price * data.quantity)}</td>
                        </tr>
                      ))}

                      <tr className="bottom text-center">
                        <td colSpan="2">Total</td>

                        <td colSpan="3">
                          {fixedTwoDigit(
                            transaction.reduce((acc, curr) => acc + curr.total_price, 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between ">
                  <div>
                    <button onClick={handlePrint} className="btn theme text-white px-5 my-1">
                      Print
                    </button>
                  </div>
                  <div className="d-flex">
                    {transaction.length !== 0 && loading && (
                      <div className="spinner-border text-secondary my-2 me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}

                    <div>
                      <button onClick={handleSell} className="btn theme text-white px-5 my-1">
                        Sell
                      </button>
                    </div>
                    <div onClick={() => setTransaction([])}>
                      <button className="btn btn-danger px-5 my-1 mx-2">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {print && (
        <div className="w-100 p-2">
          <Receipt transaction={transaction} setPrint={setPrint} />
        </div>
      )}
    </>
  );
};

export default Home;
