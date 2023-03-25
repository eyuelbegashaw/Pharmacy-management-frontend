import {ConvertDate} from "../../util/date";

const DrugForm = ({
  handleSubmit,
  handleChange,
  cleanForm,
  categories,
  handleNewUpdated,
  suppliers,
  inputs,
  edit,
  user,
}) => {
  return (
    <div onSubmit={e => handleSubmit(e)} className="ms-1 mb-1">
      <div className="row mb-3 container">
        <div className="col">
          <label htmlFor="brandName">Brand name</label>
          <input
            className="form-control"
            placeholder="brand name"
            id="brandName"
            type="text"
            name="brand_name"
            value={inputs.brand_name}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="genericName">Generic name</label>
          <input
            className="form-control"
            placeholder="generic name"
            id="genericName"
            type="text"
            name="generic_name"
            value={inputs.generic_name}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="batchNumber">Batch Number</label>
          <input
            className="form-control"
            placeholder="batch number"
            id="batchNumber"
            type="text"
            name="batch_number"
            value={inputs.batch_number}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="purchasedPrice">Purchased price</label>
          <input
            className="form-control"
            placeholder="purchased price"
            id="purchasedPrice"
            type="number"
            name="purchased_price"
            value={inputs.purchased_price}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="sellingPrice">Selling price</label>
          <input
            className="form-control"
            placeholder="selling price"
            id="sellingPrice"
            type="number"
            name="selling_price"
            value={inputs.selling_price}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="productionDate">Production date</label>
          <input
            className="form-control"
            id="productionDate"
            type="date"
            name="production_date"
            value={ConvertDate(inputs.production_date)}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="expirationDate">Expiration date</label>
          <input
            className="form-control"
            id="expirationDate"
            type="date"
            name="expiry_date"
            value={ConvertDate(inputs.expiry_date)}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="purchased_date">Purchased date </label>
          <input
            className="form-control"
            id="purchased_date "
            type="date"
            name="purchased_date"
            value={ConvertDate(inputs.purchased_date)}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="quantity">Quantity In Stock</label>
          <input
            className="form-control"
            id="quantity"
            type="number"
            name="quantity"
            value={inputs.quantity}
            readOnly={!user.isAdmin}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="quantity">Purchased Quantity</label>
          <input
            className="form-control"
            id="quantity"
            type="number"
            name="purchased_quantity"
            value={inputs.purchased_quantity}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="location">Location</label>
          <input
            placeholder="location"
            className="form-control"
            id="location"
            type="text"
            name="location"
            value={inputs.location}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="col">
          <label htmlFor="measurement_size">Measurement size</label>
          <input
            placeholder="measurement size"
            className="form-control"
            id="measurement_size"
            type="text"
            name="measurement_size"
            value={inputs.measurement_size}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="type">Type</label>
          <input
            placeholder="type"
            className="form-control"
            id="type"
            type="text"
            name="type"
            value={inputs.type}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="lowStock">Low Stock</label>
          <input
            placeholder="Low Stock"
            className="form-control"
            id="lowStock"
            type="number"
            name="lowStock"
            value={inputs.lowStock}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="remark">Remark</label>
          <input
            placeholder="remark"
            className="form-control"
            id="remark"
            type="text"
            name="remark"
            value={inputs.remark}
            onChange={e => handleChange(e)}
          />
        </div>

        <div className="col">
          <label htmlFor="category">Category</label>
          <select
            className="form-select"
            id="category"
            name="category_id"
            value={inputs.category_id}
            onChange={e => handleChange(e)}
          >
            <option value="">select</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <label htmlFor="supplier">Supplier</label>

          <select
            className="form-select"
            id="supplier"
            name="supplier_id"
            value={inputs.supplier_id}
            onChange={e => handleChange(e)}
          >
            <option value="">select</option>
            {suppliers.map(supplier => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {user.isAdmin && (
        <button className="btn theme text-white" onClick={handleSubmit}>
          {edit === true ? "Edit" : "Add"}
        </button>
      )}

      {!user.isAdmin && !edit && (
        <button className="btn theme text-white" onClick={handleSubmit}>
          Add
        </button>
      )}

      {edit && (
        <button className="ms-2 btn theme text-light" onClick={handleNewUpdated}>
          Add New
        </button>
      )}

      <button className="ms-2 btn btn-danger" onClick={cleanForm}>
        Clear
      </button>
    </div>
  );
};

export default DrugForm;
