import {userContext} from "../context/globalState";
import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";

//user Components
import UserForm from "../components/users/UserForm";
import UserTable from "../components/users/UserTable";

//APIs
import * as userAPI from "../API/authentication";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {errorMessage} from "../util/error";

const Users = () => {
  const navigate = useNavigate();

  const {user} = useContext(userContext);
  const [inputs, setInputs] = useState({
    isAdmin: "false",
    name: "",
    gender: "male",
    phone_number: "",
    status: "active",
    email: "",
    password: "",
  });

  const [users, setUsers] = useState([]);
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
        const response = await userAPI.getUsers(user.token);
        setUsers(response);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

  const cleanForm = () => {
    setInputs({
      id: "",
      isAdmin: "false",
      name: "",
      gender: "male",
      phone_number: "",
      status: "active",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      inputs.name === "" ||
      inputs.phone_number === "" ||
      inputs.email === 0 ||
      inputs.password === 0
    ) {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      if (edit) {
        try {
          const updated = await userAPI.updateUser(inputs, user.token);
          setUsers(users.map(value => (value._id === updated._id ? updated : value)));
          toast.success("Edited successfully");
          cleanForm();
        } catch (error) {
          toast.error(error.response.data.message);
        }

        setEdit(false);
      } else {
        try {
          const newUser = await userAPI.registerUser(inputs, user.token);
          setUsers([...users, newUser]);
          toast.success("Registerd successfully");
          cleanForm();
        } catch (error) {
          toast.error(errorMessage(error));
        }
      }
    }
  };

  const handleChange = e => {
    const name = e.target.name;
    setInputs({...inputs, [name]: e.target.value});
  };

  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await userAPI.deleteUser(id, user.token);
        setUsers(users.filter(data => data._id !== id));
        toast.success("Deleted successfully");
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleEdit = id => {
    setEdit(true);
    setShowAdd(true);
    let target = users.find(value => value._id === id);
    setInputs(target);
  };

  const handleAddClick = () => {
    setShowAdd(!showAdd);
    if (showAdd) {
      setEdit(false);
      cleanForm();
    }
  };

  return (
    <div className="w-100">
      <div className="w-100 theme text-white fs-4 text-center py-2 mb-2">Staff Management</div>
      <ToastContainer />
      <div className="m-2">
        <div>
          <button onClick={handleAddClick} className="btn theme text-white mb-2">
            {showAdd ? "Hide" : "Add"}
          </button>
        </div>
        {showAdd && (
          <UserForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            inputs={inputs}
            edit={edit}
          />
        )}
      </div>

      <div className="m-2">
        <UserTable datas={users} handleDelete={handleDelete} handleEdit={handleEdit} />
      </div>
    </div>
  );
};

export default Users;
