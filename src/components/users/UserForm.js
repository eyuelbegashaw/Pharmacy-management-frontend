const UserForm = ({handleSubmit, handleChange, inputs, edit, users, loading}) => {
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <div className="container">
        <div>
          <label for="name">Name</label>
          <div className="col">
            <input
              className="form-control"
              placeholder="Name"
              id="name"
              type="text"
              name="name"
              value={inputs.name}
              onChange={e => handleChange(e)}
            />
          </div>
        </div>

        <div>
          <label for="phone_number">Phone number</label>
          <input
            className="form-control"
            placeholder="phone number"
            id="phone number"
            type="text"
            name="phone_number"
            value={inputs.phone_number}
            onChange={e => handleChange(e)}
          />
        </div>

        <div>
          <label for="email">Email</label>
          <input
            className="form-control"
            placeholder="Email"
            id="email"
            type="text"
            name="email"
            value={inputs.email}
            onChange={e => handleChange(e)}
          />
        </div>

        <div>
          <label for="password">Password</label>
          <input
            className="form-control"
            placeholder="password"
            id="password"
            type="text"
            name="password"
            value={inputs.password}
            onChange={e => handleChange(e)}
          />
        </div>

        <div>
          <label for="status">Status</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={inputs.status}
            onChange={e => handleChange(e)}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        <div>
          <label for="gender">Gender</label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={inputs.gender}
            onChange={e => handleChange(e)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label for="isAdmin">Admin</label>
          <select
            className="form-select"
            id="isAdmin"
            name="isAdmin"
            value={inputs.isAdmin}
            onChange={e => handleChange(e)}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>
      </div>
      <div className="d-flex mt-2">
        <div>
          <input
            type="submit"
            value={edit === true ? "Edit" : "Add"}
            className="btn theme text-white"
          />
        </div>
        {users.length > 0 && loading && (
          <div className="spinner-border text-secondary mt-1 ms-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default UserForm;
