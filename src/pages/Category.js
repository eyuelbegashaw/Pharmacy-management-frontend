import {useNavigate} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {userContext} from "../context/globalState";

//API
import * as categoryAPI from "../API/categoryAPI";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

const Category = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const {user} = useContext(userContext);
  const [inputs, setInputs] = useState({id: "", name: ""});
  const [categories, setCategories] = useState([]);
  const [edit, setEdit] = useState(false);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await categoryAPI.getCategory(user.token);
        setCategories(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    };
    fetchData();
  }, [user.token]);

  const handleChange = e => {
    const name = e.target.name;
    setInputs({...inputs, [name]: e.target.value});
  };

  const handleDelete = async id => {
    if (window.confirm("Are you sure ?")) {
      try {
        await categoryAPI.deleteCategory(id, user.token);
        setCategories(categories.filter(value => value._id !== id));
        toast.success("Deleted Successfully");
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (inputs.name === "") {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      try {
        if (edit) {
          const updated = await categoryAPI.updateCategory(inputs, user.token);
          setCategories(categories.map(value => (value._id === inputs.id ? updated : value)));
          toast.success("Edited successfully");
        } else if (create) {
          const newData = await categoryAPI.createCategory(inputs, user.token);
          setCategories([...categories, newData]);
          toast.success("New data added successfully");
        }
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  };

  const handleEdit = category => {
    setEdit(true);
    setCreate(false);
    setInputs({
      id: category._id,
      name: category.name,
    });
  };

  const handleCreate = () => {
    setInputs({
      id: "",
      name: "",
    });

    setEdit(false);
    setCreate(true);
  };

  const handleHide = () => {
    setEdit(false);
    setCreate(false);
  };

  return (
    <div className="w-100">
      <div className="w-100 text-white fs-4 text-center py-2 mb-2  theme">Category Management</div>
      <ToastContainer />
      <div className="m-2">
        <div>
          {!create && !edit && (
            <button className="btn theme text-white" onClick={handleCreate}>
              Create
            </button>
          )}

          {(create || edit) && (
            <button className="btn theme text-white" onClick={handleHide}>
              Hide
            </button>
          )}

          {(create || edit) && (
            <form onSubmit={e => handleSubmit(e)} className="row g-3">
              <div>
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={inputs.name}
                  onChange={e => handleChange(e)}
                  style={{width: 350}}
                />
                <div className="">
                  <button type="submit" className="btn theme text-white my-2">
                    {edit ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <table className="table table-responsive p-0">
            <thead>
              <tr>
                <th> No</th>
                <th> Name</th>
                <th> Edit </th>
                <th> Delete </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td> {category.name}</td>
                  <td>
                    <button className="border-0" onClick={() => handleEdit(category)}>
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>

                  <td>
                    <button className="border-0" onClick={() => handleDelete(category._id)}>
                      <i className="fa fa-trash text-danger" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && loading && (
                <tr>
                  <td colSpan="4" className="text-center">
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
    </div>
  );
};

export default Category;
