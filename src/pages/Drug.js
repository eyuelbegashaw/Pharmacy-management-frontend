import {useNavigate} from "react-router-dom";
import {userContext} from "../context/globalState";
import {useState, useEffect, useContext} from "react";

//Drug Components
import DrugForm from "../components/drug/DrugForm";
import DrugTable from "../components/drug/DrugTable";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

//APIs
import * as drugAPI from "../API/drugAPI";
import * as categoryAPI from "../API/categoryAPI";
import * as supplierAPI from "../API/supplierAPI";

const Drug = () => {
  const navigate = useNavigate();
  const {user} = useContext(userContext);
  const [inputs, setInputs] = useState({
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
    purchased_quantity: 0,
    type: "",
    location: "",
    remark: "",
    measurement_size: "",
    lowStock: 0,
  });

  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRow, setSelectedRow] = useState("");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [fetchedDrugs, setFetcheDrugs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await categoryAPI.getCategory(user.token);
        const suppliers = await supplierAPI.getSupplier(user.token);
        const response = await drugAPI.getDrug(user.token);
        setDrugs(response);
        setFetcheDrugs(response);
        setCategories(categories);
        setSuppliers(suppliers);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

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

  const cleanForm = () => {
    setInputs({
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
      purchased_quantity: 0,
      type: "",
      location: "",
      remark: "",
      measurement_size: "",
      lowStock: 0,
    });
  };

  const emptyFields = () => {
    if (
      inputs.brand_name === "" ||
      inputs.generic_name === "" ||
      inputs.batch_number === "" ||
      inputs.purchased_price <= 0 ||
      inputs.selling_price <= 0 ||
      inputs.production_date === "" ||
      inputs.expiry_date === "" ||
      inputs.purchased_date === "" ||
      inputs.purchased_quantity <= 0 ||
      inputs.type === "" ||
      inputs.location === "" ||
      inputs.category_id === "" ||
      inputs.supplier_id === "" ||
      inputs.measurement_size === "" ||
      inputs.lowStock <= 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    let empty = emptyFields();
    if (empty) {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      if (edit) {
        try {
          const updated = await drugAPI.updateDrug(inputs, user.token);
          setDrugs(drugs.map(value => (value._id === updated._id ? updated : value)));
          toast.success("Drug Edited successfully");
          setSelectedRow("");
          cleanForm();
        } catch (error) {
          toast.error(errorMessage(error));
        }

        setEdit(false);
      } else {
        try {
          if (inputs.quantity !== inputs.purchased_quantity) {
            toast.error("Quantity in Stock and Purchased quantity must be equal");
          } else {
            const newData = await drugAPI.createDrug(inputs, user.token);
            setDrugs([...drugs, newData]);
            toast.success("New Drug added successfully");
            cleanForm();
          }
        } catch (error) {
          toast.error(errorMessage(error));
        }
      }
    }
  };

  const handleNewUpdated = async () => {
    try {
      let empty = emptyFields();
      if (empty) {
        toast.error("Please make sure all fields are filled in correctly");
      } else if (Number(inputs.quantity) !== Number(inputs.purchased_quantity)) {
        toast.error("Quantity In Stock and Purchased Quantity Must Be Equal");
      } else {
        let newDrug = {...inputs};
        delete newDrug._id;
        const newData = await drugAPI.createDrug(newDrug, user.token);
        setDrugs([...drugs, newData]);
        toast.success("New Drug added successfully");
        cleanForm();
      }
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleChange = e => {
    const name = e.target.name;

    if (name === "purchased_quantity" && !user.isAdmin) {
      setInputs({...inputs, quantity: e.target.value, purchased_quantity: e.target.value});
    } else {
      setInputs({...inputs, [name]: e.target.value});
    }
  };

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await drugAPI.deleteDrug(id, user.token);
        setDrugs(drugs.filter(value => value._id !== id));
        toast.success("Drug Deleted Successfully");
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleEdit = id => {
    setSelectedRow(id);
    setEdit(true);
    setShowAdd(true);
    let target = drugs.find(value => value._id === id);

    let obj = {
      ...target,
      category_id: target.category_id ? target.category_id._id : "",
      supplier_id: target.supplier_id ? target.supplier_id._id : "",
    };
    setInputs(obj);
  };

  const handleAddClick = () => {
    setShowAdd(!showAdd);
    if (showAdd) {
      setEdit(false);
      setSelectedRow("");
      cleanForm();
    }
  };

  return (
    <>
      <div className="horizontalTable">
        <ToastContainer />
        <div className="text-white fs-4 text-center py-2 mb-2  theme">Drug Management</div>
        <div>
          <div>
            <button onClick={handleAddClick} className="btn theme text-white mb-2 ms-1">
              {showAdd ? "Hide" : "Add"}
            </button>
          </div>
          {showAdd && (
            <DrugForm
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleNewUpdated={handleNewUpdated}
              categories={categories}
              suppliers={suppliers}
              cleanForm={cleanForm}
              inputs={inputs}
              edit={edit}
              user={user}
            />
          )}
        </div>
        <div className="d-sm-flex justify-content-center mb-2 ms-1">
          <div className="search flex-fill me-sm-2">
            <input
              type="text"
              className="border border-dark form-control"
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="What are you looking for?"
            />
          </div>

          <div className="flex-fill">
            <select
              className="form-select border border-dark"
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
        </div>

        <div>
          <DrugTable
            drugs={drugs}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRow={selectedRow}
          />
        </div>
      </div>
    </>
  );
};

export default Drug;
