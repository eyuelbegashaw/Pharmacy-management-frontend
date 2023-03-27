import {ConvertDate} from "../../util/date";

const HomeForm = ({handleSubmit, handleChange, handleClear, inputs}) => {
  return (
    <div>
      <div className="homeForm m-2">
        <div className="col">
          <label htmlFor="brandName">Brand Name</label>
          <input
            className="form-control"
            placeholder="brand name"
            id="brandName"
            type="text"
            name="brand_name"
            readOnly
            value={inputs.brand_name}
          />
        </div>

        <div className="col">
          <label htmlFor="genericName">Generic Name</label>
          <input
            className="form-control"
            placeholder="generic name"
            id="genericName"
            type="text"
            name="generic_name"
            readOnly
            value={inputs.generic_name}
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
            readOnly
            value={inputs.batch_number}
          />
        </div>

        <div className="col">
          <label htmlFor="purchasedPrice">Purchased Price</label>
          <input
            className="form-control"
            placeholder="purchased price"
            id="purchasedPrice"
            type="number"
            name="purchased_price"
            readOnly
            value={inputs.purchased_price}
          />
        </div>

        <div className="col">
          <label htmlFor="productionDate">Production Date</label>
          <input
            className="form-control"
            id="productionDate"
            type="date"
            name="production_date"
            readOnly
            value={ConvertDate(inputs.production_date)}
          />
        </div>

        <div className="col">
          <label htmlFor="expirationDate">Expiration Date</label>
          <input
            className="form-control"
            id="expirationDate"
            type="date"
            name="expiry_date"
            readOnly
            value={ConvertDate(inputs.expiry_date)}
          />
        </div>

        <div className="col">
          <label htmlFor="sellingPrice">Selling Price</label>
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
          <label htmlFor="quantity">Quantity</label>
          <input
            className="form-control"
            id="quantity"
            type="number"
            name="quantity"
            value={inputs.quantity}
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
            readOnly
            value={inputs.location}
          />
        </div>
      </div>

      <div className="d-flex mt-3 ms-2">
        <div className="me-2">
          <button className="btn theme text-white" onClick={handleSubmit}>
            Add To Cart
          </button>
        </div>

        <div>
          <button className="btn btn-danger" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeForm;
