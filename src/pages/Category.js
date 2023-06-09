import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {useGlobalState} from "../context/GlobalProvider";

//API
import * as categoryAPI from "../API/categoryAPI";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

const Category = () => {
  const navigate = useNavigate();
  const {user, categories, setCategories, loading, setLoading} = useGlobalState();
  const {categoriesLoading} = loading;

  const [edit, setEdit] = useState(false);
  const [create, setCreate] = useState(false);
  const [inputs, setInputs] = useState({id: "", name: ""});

  useEffect(() => {
    if (!user || user.status !== "active" || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

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
      setLoading(prevState => ({...prevState, categoriesLoading: true}));
      try {
        if (edit) {
          const updated = await categoryAPI.updateCategory(inputs, user.token);
          setCategories(categories.map(value => (value._id === inputs.id ? updated : value)));
          toast.success("Category edited successfully");
        } else if (create) {
          const newData = await categoryAPI.createCategory(inputs, user.token);
          setCategories([...categories, newData]);
          toast.success("Category added successfully");
        }
        setLoading(prevState => ({...prevState, categoriesLoading: false}));
      } catch (error) {
        setLoading(prevState => ({...prevState, categoriesLoading: false}));
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
                <div className="d-flex mt-2">
                  <div>
                    <button type="submit" className="btn theme text-white">
                      {edit ? "Update" : "Create"}
                    </button>
                  </div>

                  {categories.length > 0 && categoriesLoading && (
                    <div className="spinner-border text-secondary mt-1 ms-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
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
              {categories.length === 0 && categoriesLoading && (
                <tr>
                  <td colSpan="4" className="text-center">
                    <div className="spinner-border text-secondary my-2 me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}

              {categories.length === 0 && !categoriesLoading && (
                <tr>
                  <td colSpan="4" className="text-center">
                    <span className="visually-hidden">No Data Available</span>
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
