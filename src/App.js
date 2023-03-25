import {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

//Components
import SideNav from "./components/SideNav";

//Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Drug from "./pages/Drug";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import FollowUp from "./pages/FollowUp";
import Category from "./pages/Category";
import Suppliers from "./pages/Suppliers";
import DailyStock from "./pages/DailyStock";
import RangeStock from "./pages/RangeStock";
import DailyTransaction from "./pages/DailyTransaction";
import RangeTransaction from "./pages/RangeTransaction";

//Global State
import {userContext} from "./context/globalState";

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      setUser(token);
    } else {
      setUser(null);
    }
  }, []);

  return (
    <userContext.Provider value={{user, setUser}}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/:resetLink" element={<Login />} />

          <Route path="/" element={<SideNav />}>
            <Route index element={<Home />} />
            <Route path="drug" element={<Drug />} />
            <Route path="followUp" element={<FollowUp />} />
            <Route path="dailyTransaction" element={<DailyTransaction />} />
            <Route path="profile" element={<Profile />} />

            {user && user.isAdmin && (
              <>
                <Route path="dailyStock" element={<DailyStock />} />
                <Route path="rangeStock" element={<RangeStock />} />
                <Route path="rangeTransaction" element={<RangeTransaction />} />
                <Route path="category" element={<Category />} />
                <Route path="users" element={<Users />} />
                <Route path="suppliers" element={<Suppliers />} />{" "}
              </>
            )}
          </Route>
        </Routes>
      </Router>
    </userContext.Provider>
  );
}

export default App;
