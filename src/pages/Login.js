import {userContext} from "../context/globalState";
import {useNavigate, useParams} from "react-router-dom";
import {useState, useContext, useEffect} from "react";

//APIS
import * as authenicationAPI from "../API/authentication";

//Toast component
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

const Login = () => {
  const {resetLink} = useParams();

  const navigate = useNavigate();

  const {setUser} = useContext(userContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {email, password} = formData;

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [login, setLogin] = useState(true);
  const [valid, setValid] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [emailRequest, setEmailRequest] = useState("");

  useEffect(() => {
    const checkLink = async () => {
      try {
        if (resetLink !== undefined) {
          const response = await authenicationAPI.CheckLink({resetLink});
          if (response) {
            setValid(true);
            setForgotPassword(false);
            setLogin(false);
          }
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkLink();
  }, [navigate, resetLink]);

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (valid) {
      handleNewPassword();
    } else if (login) {
      handleLogin();
    } else if (forgotPassword) {
      handleForgotPassword();
    }
  };

  const handleForgotPassword = async () => {
    if (emailRequest === "") {
      toast.error("Empty Fields");
    } else {
      try {
        setLoading(true);
        await authenicationAPI.forgotPassword({email: emailRequest});
        setEmailSent(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    }
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      toast.error("Empty Fields");
    } else {
      try {
        setLoading(true);
        const response = await authenicationAPI.Login(formData);
        if (response) {
          localStorage.setItem("user", JSON.stringify(response));
          setUser(response);
          navigate("/");
        } else {
          toast.error("invalid credentials");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("invalid credentials");
      }
    }
  };

  const handleNewPassword = async () => {
    if (password1 === "" || password2 === "") {
      toast.error("All fields are required");
    } else if (password1 !== password2) {
      toast.error("Passwords do not match");
    } else {
      try {
        setLoading(true);
        const response = await authenicationAPI.resetPassword({
          resetLink,
          newPassword: password1,
        });

        if (response) {
          toast.success("password updated successfully");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    }
  };

  return (
    <>
      <div className="w-100 text-white fs-3 text-center py-3 fw-bold theme2">
        BENET PHARMACY MANAGEMENT SYSTEM
      </div>
      <div className="d-md-flex fullHeight pt-3">
        <ToastContainer />
        <div className="myImage flex-grow-1">
          <img src="/Background2.jpg" alt="Benet pharmacy" className="img-fluid" />
        </div>
        <div className="mx-3 fw-bold ">
          {!emailSent && (
            <div className="loginWidth">
              <div className="d-flex  my-2">
                <div className="fs-2 fw-bold">
                  {forgotPassword && <div>FORGOT YOUR PASSWORD? </div>}
                  {valid && <div> NEW PASSWORD </div>}
                  {login && <div>SIGN IN</div>}
                </div>

                {loading && (
                  <div className="spinner-border text-secondary ms-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>

              <div>
                {login && (
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="form2Example1"
                      className="form-control"
                      name="email"
                      placeholder="Enter email"
                      onChange={onChange}
                      value={email}
                    />
                  </div>
                )}

                {forgotPassword && (
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="form2Example1"
                      className="form-control"
                      name="email"
                      placeholder="Enter email"
                      onChange={e => setEmailRequest(e.target.value)}
                      value={emailRequest}
                    />
                  </div>
                )}

                {valid && (
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">
                      New Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="form2Example1"
                      className="form-control"
                      value={password1}
                      placeholder="Enter new password"
                      onChange={e => setPassword1(e.target.value)}
                    />
                  </div>
                )}

                {valid && (
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="form2Example1"
                      className="form-control"
                      value={password2}
                      placeholder="Confirm new password"
                      onChange={e => setPassword2(e.target.value)}
                    />
                    <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> {"  "}{" "}
                    show Password
                  </div>
                )}

                {login && (
                  <>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form2Example2">
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="form2Example2"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Enter password"
                      />
                      <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />{" "}
                      {"  "} show Password
                    </div>
                  </>
                )}

                <div>
                  {login && (
                    <div>
                      <span
                        onClick={() => {
                          setForgotPassword(true);
                          setLogin(false);
                          setValid(false);
                        }}
                      >
                        forgot password ?
                      </span>
                    </div>
                  )}

                  {forgotPassword && (
                    <div>
                      <span
                        onClick={() => {
                          setForgotPassword(false);
                          setLogin(true);
                          setValid(false);
                        }}
                      >
                        Login
                      </span>
                    </div>
                  )}

                  {valid && (
                    <div>
                      <span
                        onClick={() => {
                          setForgotPassword(false);
                          setLogin(true);
                          setValid(false);
                        }}
                      >
                        Login
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    className="button btn theme2 border mt-3 text-white loginWidth"
                  >
                    {forgotPassword && "Reset Password"}
                    {login && "Login"}
                    {valid && "Change Password"}
                  </button>

                  <br />
                </div>
              </div>
            </div>
          )}

          {emailSent && (
            <div className="p-2 loginWidth">
              <h4>Confirm Email</h4>
              <p>
                A password reset message was sent to your email address. Please clik the link in
                that message to reset your password. if you do not receive the password reset
                message within a few moments ,please check your spam folder or other filtering
                tools.
              </p>
              <p>
                if you do not receive the password reset message within a few moments ,please check
                your spam folder or other filtering tools.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
