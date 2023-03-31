import {useNavigate} from "react-router-dom";
import {useGlobalState} from "../context/GlobalProvider";
import {useState, useEffect} from "react";

//Drug Components
import DrugForm from "../components/drug/DrugForm";
import DrugTable from "../components/drug/DrugTable";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

//APIs
import * as drugAPI from "../API/drugAPI";

const Drug = () => {
  const navigate = useNavigate();
  const {
    user,
    setDrugs,
    allDrugs,
    setAllDrugs,
    categories,
    suppliers,
    loading,
    setLoading,
    setExpiredDrugs,
  } = useGlobalState();
  const {allDrugsLoading} = loading;

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

  const [edit, setEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState("brand_name");
  const [selectedRow, setSelectedRow] = useState("");
  const [filteredAllDrugs, setFilteredAllDrugs] = useState(allDrugs);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    setFilteredAllDrugs(allDrugs);
  }, [JSON.stringify(allDrugs)]);

  useEffect(() => {
    const handleSearch = () => {
      let filteredData = allDrugs;
      if (searchTerm.trim() !== "") {
        if (category !== "all") {
          if (filterName === "generic_name") {
            filteredData = allDrugs.filter(
              item =>
                item.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (category === "" || item.category_id.name === category)
            );
          } else {
            filteredData = allDrugs.filter(
              item =>
                item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (category === "" || item.category_id.name === category)
            );
          }
        } else if (category === "all") {
          if (filterName === "generic_name") {
            filteredData = allDrugs.filter(item => {
              return item.generic_name.toLowerCase().includes(searchTerm.toLowerCase());
            });
          } else {
            filteredData = allDrugs.filter(item => {
              return item.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
            });
          }
        }
      } else if (category !== "" && category !== "all") {
        filteredData = allDrugs.filter(
          item => item.category_id && item.category_id.name === category
        );
      }
      setFilteredAllDrugs(filteredData);
    };

    handleSearch();
  }, [searchTerm, category, filterName]);

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
      inputs.quantity <= 0 ||
      !Number.isInteger(Number(inputs.quantity)) ||
      inputs.purchased_quantity <= 0 ||
      !Number.isInteger(Number(inputs.purchased_quantity)) ||
      inputs.type === "" ||
      inputs.location === "" ||
      inputs.category_id === "" ||
      inputs.supplier_id === "" ||
      inputs.measurement_size === "" ||
      inputs.lowStock <= 0 ||
      !Number.isInteger(Number(inputs.lowStock))
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
      try {
        setLoading(prevState => ({...prevState, allDrugsLoading: true}));
        if (edit) {
          const updated = await drugAPI.updateDrug(inputs, user.token);
          setAllDrugs(allDrugs.map(value => (value._id === updated._id ? updated : value)));
          toast.success("Drug Edited successfully");
          setSelectedRow("");
          cleanForm();
          setEdit(false);
        } else {
          if (inputs.quantity !== inputs.purchased_quantity) {
            toast.error("Quantity in Stock and Purchased quantity must be equal");
          } else {
            const newData = await drugAPI.createDrug(inputs, user.token);
            setAllDrugs([...allDrugs, newData]);
            toast.success("New Drug added successfully");
            cleanForm();
          }
        }
        setLoading(prevState => ({...prevState, allDrugsLoading: false}));

        const Drugs = await drugAPI.getDrug(user.token);
        setDrugs(Drugs);

        const ExpiredDrugs = await drugAPI.getExpiredDrug(user.token);
        setExpiredDrugs(ExpiredDrugs);
      } catch (error) {
        setLoading(prevState => ({...prevState, allDrugsLoading: false}));
        toast.error(errorMessage(error));
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
        setLoading(prevState => ({...prevState, allDrugsLoading: true}));
        let newDrug = {...inputs};
        delete newDrug._id;
        const newData = await drugAPI.createDrug(newDrug, user.token);
        setAllDrugs([...allDrugs, newData]);
        toast.success("New Drug added successfully");
        cleanForm();
        setLoading(prevState => ({...prevState, allDrugsLoading: false}));

        const Drugs = await drugAPI.getDrug(user.token);
        setDrugs(Drugs);

        const ExpiredDrugs = await drugAPI.getExpiredDrug(user.token);
        setExpiredDrugs(ExpiredDrugs);
      }
    } catch (error) {
      setLoading(prevState => ({...prevState, allDrugsLoading: false}));
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
        setAllDrugs(allDrugs.filter(value => value._id !== id));
        toast.success("Drug Deleted Successfully");

        const Drugs = await drugAPI.getDrug(user.token);
        setDrugs(Drugs);

        const ExpiredDrugs = await drugAPI.getExpiredDrug(user.token);
        setExpiredDrugs(ExpiredDrugs);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleEdit = id => {
    setSelectedRow(id);
    setEdit(true);
    setShowAdd(true);
    let target = allDrugs.find(value => value._id === id);

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
        <div className="text-white fs-4 text-center py-2 mb-2  theme">Drug Management</div>
        <div>
          <div className="d-flex">
            <div>
              <button onClick={handleAddClick} className="btn theme text-white mb-2 ms-1">
                {showAdd ? "Hide" : "Add"}
              </button>
            </div>
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
              allDrugsLoading={allDrugsLoading}
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

          <div className="flex-fill border rounded border-dark me-sm-2">
            <select
              className="form-select"
              id="category"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            >
              <option value="brand_name">brand name</option>
              <option value="generic_name">generic name</option>
            </select>
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
            drugs={filteredAllDrugs}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRow={selectedRow}
            allDrugsLoading={allDrugsLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Drug;
