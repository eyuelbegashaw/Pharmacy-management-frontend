import {userContext} from "../context/globalState";
import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";

//Supplier componenents
import SupplierForm from "../components/supplier/SupplierForm";
import SupplierTable from "../components/supplier/SupplierTable";

//APIs
import * as supplierAPI from "../API/supplierAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

import {errorMessage} from "../util/error";

const Supplier = () => {
  const navigate = useNavigate();
  const {user} = useContext(userContext);
  const [image, setImage] = useState("");
  const [inputs, setInputs] = useState({
    _id: "",
    name: "",
    phone_number: "",
  });

  const [datas, setDatas] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supplierAPI.getSupplier(user.token);
        setDatas(response);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("data", JSON.stringify({name: inputs.name, phone_number: inputs.phone_number}));

    if (inputs.name === "" || inputs.phone_number === "") {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      try {
        if (edit) {
          const updated = await supplierAPI.updateSupplier(inputs._id, formData, user.token);
          setDatas(datas.map(value => (value._id === inputs._id ? updated : value)));
          toast.success("Edited successfully");
        } else {
          const newData = await supplierAPI.createSupplier(formData, user.token);
          setDatas([...datas, newData]);
          toast.success("New data added successfully");
        }
      } catch (error) {
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
        setDatas(datas.filter(data => data._id !== id));
        toast.success("Deleted successfully");
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleEdit = id => {
    setEdit(true);
    setShowAdd(true);
    let target = datas.find(value => value._id === id);
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
      <ToastContainer />
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
          />
        )}
      </div>

      <div className="2">
        <SupplierTable datas={datas} handleDelete={handleDelete} handleEdit={handleEdit} />
      </div>
    </div>
  );
};

export default Supplier;
