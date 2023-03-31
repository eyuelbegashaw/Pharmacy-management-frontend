import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useGlobalState} from "../context/GlobalProvider";

//Supplier componenents
import SupplierForm from "../components/supplier/SupplierForm";
import SupplierTable from "../components/supplier/SupplierTable";

//APIs
import * as supplierAPI from "../API/supplierAPI";

//Toast component
import {toast} from "react-toastify";

//Utils
import {errorMessage} from "../util/error";

const Supplier = () => {
  const navigate = useNavigate();
  const {user, suppliers, setSuppliers, loading, setLoading} = useGlobalState();
  const {suppliersLoading} = loading;

  const [image, setImage] = useState("");
  const [inputs, setInputs] = useState({
    _id: "",
    name: "",
    phone_number: "",
  });

  const [edit, setEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("data", JSON.stringify({name: inputs.name, phone_number: inputs.phone_number}));

    if (inputs.name === "" || inputs.phone_number === "") {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      try {
        setLoading(prevState => ({...prevState, suppliersLoading: true}));
        if (edit) {
          const updated = await supplierAPI.updateSupplier(inputs._id, formData, user.token);
          setSuppliers(suppliers.map(value => (value._id === inputs._id ? updated : value)));
          toast.success("Edited successfully");
        } else {
          const newData = await supplierAPI.createSupplier(formData, user.token);
          setSuppliers([...suppliers, newData]);
          toast.success("New data added successfully");
        }
        setLoading(prevState => ({...prevState, suppliersLoading: false}));
      } catch (error) {
        setLoading(prevState => ({...prevState, suppliersLoading: false}));
        toast.error(errorMessage(error));
      }
    }
  };

  const handleChange = e => {
    const name = e.target.name;
    if (name === "image") {
      setImage(e.target.files[0]);
    } else {
      setInputs({...inputs, [name]: e.target.value});
    }
  };

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await supplierAPI.deleteSupplier(id, user.token);
        setSuppliers(suppliers.filter(data => data._id !== id));
        toast.success("Deleted successfully");
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleEdit = id => {
    setEdit(true);
    setShowAdd(true);
    let target = suppliers.find(value => value._id === id);
    setInputs(target);
  };

  //show and hide the form
  const handleAddClick = () => {
    setShowAdd(!showAdd);
    if (showAdd) {
      setEdit(false);
      setInputs({
        id: "",
        name: "",
        phone_number: "",
      });
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 theme text-white fs-4 text-center py-2 mb-2">Supplier Management</div>
      <div className="m-2">
        <div>
          <button onClick={handleAddClick} className="btn theme text-white mb-2">
            {showAdd ? "Hide" : "Add"}
          </button>
        </div>
        {showAdd && (
          <SupplierForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            inputs={inputs}
            edit={edit}
            suppliersLength={suppliers.length}
            suppliersLoading={suppliersLoading}
          />
        )}
      </div>

      <div className="2">
        <SupplierTable
          suppliers={suppliers}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          suppliersLoading={suppliersLoading}
        />
      </div>
    </div>
  );
};

export default Supplier;
