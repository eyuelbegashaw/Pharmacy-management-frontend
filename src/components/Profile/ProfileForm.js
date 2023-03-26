const ProfileForm = ({handleSubmit, handleChange, inputs}) => {
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <div className="d-sm-flex justify-content-around">
        <div className="d-flex flex-column">
          <div className="border maxWidth">
            <label htmlFor="name">Name</label>
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
            <label htmlFor="phone_number">Phone number</label>
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
            <div>
              <label htmlFor="email">Email</label>
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
          </div>
        </div>
        <div className="maxWidth">
          <div>
            <label htmlFor="password">Password</label>
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
            <label htmlFor="gender">Gender</label>
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
        </div>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <input
          type="submit"
          value="Update"
          className="mt-3 btn theme text-white"
          style={{width: 200}}
        />
      </div>
    </form>
  );
};

export default ProfileForm;
