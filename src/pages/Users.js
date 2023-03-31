import {useGlobalState} from "../context/GlobalProvider";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

//user Components
import UserForm from "../components/users/UserForm";
import UserTable from "../components/users/UserTable";

//APIs
import * as userAPI from "../API/authentication";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

const Users = () => {
  const navigate = useNavigate();

  const {user, users, setUsers, loading, setLoading} = useGlobalState();
  const {usersLoading} = loading;

  const [inputs, setInputs] = useState({
    isAdmin: "false",
    name: "",
    gender: "male",
    phone_number: "",
    status: "active",
    email: "",
    password: "",
  });

  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

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
      try {
        setLoading(prevState => ({...prevState, usersLoading: true}));
        if (edit) {
          const updated = await userAPI.updateUser(inputs, user.token);
          setUsers(users.map(value => (value._id === updated._id ? updated : value)));
          toast.success("Edited successfully");
          cleanForm();
          setEdit(false);
        } else {
          const newUser = await userAPI.registerUser(inputs, user.token);
          setUsers([...users, newUser]);
          toast.success("Registerd successfully");
          cleanForm();
        }
        setLoading(prevState => ({...prevState, usersLoading: false}));
      } catch (error) {
        setLoading(prevState => ({...prevState, usersLoading: false}));
        toast.error(errorMessage(error));
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
            usersLength={users.length}
            usersLoading={usersLoading}
          />
        )}
      </div>

      <div className="m-2">
        <UserTable
          users={users}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          usersLoading={usersLoading}
        />
      </div>
    </div>
  );
};

export default Users;
