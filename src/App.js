import {HashRouter as Router, Routes, Route} from "react-router-dom";

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

//Global state
import {GlobalStateProvider} from "./context/GlobalProvider";

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <Routes>
          <Route path="/">
            <Route path="" element={<SideNav />}>
              <Route index element={<Home />} />
              <Route path="drug" element={<Drug />} />
              <Route path="followUp" element={<FollowUp />} />
              <Route path="dailyTransaction" element={<DailyTransaction />} />
              <Route path="profile" element={<Profile />} />
              <Route path="dailyStock" element={<DailyStock />} />
              <Route path="rangeStock" element={<RangeStock />} />
              <Route path="rangeTransaction" element={<RangeTransaction />} />
              <Route path="category" element={<Category />} />
              <Route path="users" element={<Users />} />
              <Route path="suppliers" element={<Suppliers />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="login/:resetLink" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
