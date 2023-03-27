const SupplierForm = ({handleSubmit, handleChange, inputs, edit, suppliers, loading}) => {
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <div style={{width: 500}}>
        <label for="name">Name</label>
        <div>
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

        <div>
          <label for="name">Phone number</label>
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

        <div className="col-md-6">
          <div className="mb-3">
            <label for="formFile" className="form-label">
              Image
            </label>
            <input
              className="form-control"
              type="file"
              name="image"
              id="formFile"
              onChange={e => handleChange(e)}
            />
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div>
          <input
            type="submit"
            value={edit === true ? "Edit" : "Add"}
            className="btn theme text-white"
          />
        </div>
        {suppliers.length > 0 && loading && (
          <div className="spinner-border text-secondary mt-1 ms-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default SupplierForm;
