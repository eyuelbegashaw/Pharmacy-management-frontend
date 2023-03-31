import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useGlobalState} from "../context/GlobalProvider";

//Profile component
import ProfileForm from "../components/Profile/ProfileForm";

//APIs
import * as profileAPI from "../API/profileAPI";

//Toast component
import {toast} from "react-toastify";

//Util
import {errorMessage} from "../util/error";

const Profile = () => {
  const navigate = useNavigate();
  const {user} = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    gender: "",
    phone_number: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await profileAPI.getProfile(user.token);
        setInputs(response);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    };

    fetchData();
  }, [user.token]);

  useEffect(() => {
    if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = e => {
    const name = e.target.name;
    setInputs({...inputs, [name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (inputs.name === "" || inputs.phone_number === "" || inputs.email === "") {
      toast.error("Please make sure all fields are filled in correctly");
    } else {
      try {
        setLoading(true);
        const updated = await profileAPI.updateProfile(inputs, user.token);
        setInputs(updated);
        toast.success("Edited successfully");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(errorMessage(error));
      }
    }
  };

  return (
    <div className="container-fluid mt-1">
      <div>
        <ProfileForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          inputs={inputs}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Profile;
