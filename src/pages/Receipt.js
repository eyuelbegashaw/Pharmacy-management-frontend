import {useState} from "react";
//import {ToWords} from "to-words";

import {ConvertDate} from "../util/date";

const Receipt = ({transaction, setPrint}) => {
  //const toWords = new ToWords();

  const [inputs, setInputs] = useState({
    idNumber: "",
    tinNumber: "",
    name: "",
    address: "",
    city: "",
  });

  const fixedTwoDigit = num => {
    if (num !== "") {
      return num.toFixed(2);
    } else return "";
  };

  const handleChange = e => {
    const name = e.target.name;
    setInputs({...inputs, [name]: e.target.value});
  };

  return (
    <>
      <div id="divToPrint">
        <div className="d-flex py-4">
          <div className="mb-4">
            <img src="logo.jpg" alt="Benet pharmacy logo" style={{width: 190}} />
          </div>
          <div className="mt-2">
            <span className="fw-bold fs-1">BENET PHARMACY</span> <br />
            <span className="fs-4">Addis Ababa yeka k/k woreda 12 , H/NO - 364</span> <br />
            <span className="fs-4">
              <span className="fw-bold"> TEL </span> +251934716908 +251940051671
            </span>
            <br />
            <span className="fs-4">
              <span className="fw-bold">TIN </span>0073763418
            </span>
            <br />
          </div>
        </div>
        <div>
          <div className="text-center fs-2 fw-bold">Cash Sales Attachment</div>

          <div className="fs-4 ms-2">
            <span className="fw-bold">DATE: </span> {new Date().toLocaleDateString()}
            <div className="fw-bold my-2">Customer Information</div>
            <div className="d-flex">
              <label htmlFor="name" className="fw-bold">
                Customer Name
              </label>
              <div className="flex-fill">
                <input
                  className="ms-3 receiptInput flex-fill"
                  id="name"
                  type="text"
                  name="name"
                  value={inputs.name}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="d-flex">
              <label htmlFor="idNumber" className="fw-bold">
                ID No
              </label>
              <div style={{marginLeft: "136px"}} className="flex-fill">
                <input
                  className="receiptInput"
                  id="idNumber"
                  type="text"
                  name="idNumber"
                  value={inputs.idNumber}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="d-flex">
              <label htmlFor="tinNumber" className="fw-bold">
                Tin
              </label>
              <div style={{marginLeft: "165px"}} className="flex-fill">
                <input
                  className="receiptInput"
                  id="tinNumber"
                  type="text"
                  name="tinNumber"
                  value={inputs.tinNumber}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="d-flex">
              <label htmlFor="address" className="fw-bold">
                Address
              </label>
              <div style={{marginLeft: "108px"}} className="flex-fill">
                <input
                  className="receiptInput"
                  id="address"
                  type="text"
                  name="address"
                  value={inputs.address}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
            <div className="d-flex">
              <label htmlFor="city" className="fw-bold">
                City
              </label>
              <div style={{marginLeft: "156px"}} className="flex-fill">
                <input
                  className="receiptInput"
                  id="city"
                  type="text"
                  name="city"
                  value={inputs.city}
                  onChange={e => handleChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-1 fs-5 mt-3">
          <div>
            <table className="table table-borderless">
              <thead>
                <tr className="border-bottom">
                  <th scope="col">Item Description</th>
                  <th scope="col">Batch#</th>
                  <th scope="col">Expirty Date</th>
                  <th scope="col">UoM</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Total Price</th>
                </tr>
              </thead>

              <tbody>
                {transaction.map((data, index) => (
                  <tr key={index}>
                    <td>{data.brand_name}</td>
                    <td>{data.batch_number}</td>
                    <td>{ConvertDate(data.expiry_date)}</td>
                    <td>{data.measurement_size}</td>
                    <td>{data.quantity}</td>
                    <td>{fixedTwoDigit(data.price)}</td>
                    <td>{fixedTwoDigit(data.price * data.quantity)}</td>
                  </tr>
                ))}

                <tr className="fw-bold">
                  <td colSpan="6"></td>

                  <td colSpan="1 text-left">
                    <span className="text-left pe-2">Sub Total: </span>
                    {fixedTwoDigit(
                      transaction.reduce((acc, curr) => acc + curr.total_price, 0) -
                        transaction.reduce((acc, curr) => acc + curr.total_price, 0) * 0.02
                    )}
                  </td>
                </tr>

                <tr className="fw-bold">
                  <td colSpan="6"></td>

                  <td colSpan="1 text-left">
                    <span className="text-left pe-2">
                      TOT (2%):{" "}
                      {fixedTwoDigit(
                        transaction.reduce((acc, curr) => acc + curr.total_price, 0) * 0.02
                      )}
                    </span>
                  </td>
                </tr>

                <tr className="fw-bold">
                  <td colSpan="6"></td>

                  <td colSpan="1 text-left">
                    <span className="text-left pe-2">Grand Total: </span>
                    {fixedTwoDigit(transaction.reduce((acc, curr) => acc + curr.total_price, 0))}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="my-4 fs-4">
              <p className="fs-4">Total amount in words : Birr only</p>

              <p className="fs-4">
                I received the above goods/services in good condition
                _________________________________
              </p>

              <p>Memo / Note</p>

              <div className="d-flex justify-content-around">
                <div className="me-3">Prepared by : ______________________________</div>
                <div>Checked By : ______________________________ </div>
              </div>

              <div className="w-100 mt-5 text-center">Email: benetpharmacy@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <button onClick={() => window.print()} className="btn theme text-white px-5 my-1">
          Print
        </button>
        <button onClick={() => setPrint()} className="btn btn-danger text-white px-5 ms-3 my-1">
          Cancel
        </button>
      </div>
    </>
  );
};

export default Receipt;
