import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {userContext} from "../context/globalState";
import {useContext, useEffect} from "react";

const SideNav = () => {
  const navigate = useNavigate();
  const {user, setUser} = useContext(userContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.status === "active") {
      setUser(user);
    } else if (!user || user.status !== "active") {
      navigate("/login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {user && (
        <div className="d-md-flex  align-items-stretch" style={{minHeight: "100vh"}}>
          <nav className="theme text-light p-1">
            <div className="d-md-flex flex-column p-1 navbars">
              <NavLink to="/" className="text-decoration-none mb-2 fs-6">
                Home
              </NavLink>
              <hr />
              <NavLink to="/drug" className="text-decoration-none mb-2 fs-6">
                Drug
              </NavLink>
              <hr />
              <NavLink to="/dailyTransaction" className="text-decoration-none mb-2 fs-6">
                Daily Transaction
              </NavLink>
              <hr />
              {user.isAdmin && (
                <>
                  <NavLink to="/rangeTransaction" className="text-decoration-none mb-2 fs-6">
                    Range Transaction
                  </NavLink>
                  <hr />

                  <NavLink to="/dailyStock" className="text-decoration-none mb-2 fs-6">
                    Daily Stock Report
                  </NavLink>
                  <hr />
                  <NavLink to="/rangeStock" className="text-decoration-none mb-2 fs-6">
                    Range Stock
                  </NavLink>
                  <hr />

                  <NavLink to="/category" className="text-decoration-none mb-2 fs-6">
                    Category
                  </NavLink>
                  <hr />
                  <NavLink to="/users" className="text-decoration-none mb-2 fs-6">
                    Staff
                  </NavLink>
                  <hr />
                  <NavLink to="/suppliers" className="text-decoration-none mb-2 fs-6">
                    Suppliers
                  </NavLink>
                  <hr />
                </>
              )}
              <NavLink to="/followUp" className="text-decoration-none mb-2 fs-6">
                Follow up
              </NavLink>
              <hr />
              <NavLink to="/profile" className="text-decoration-none mb-2 fs-6">
                Profile
              </NavLink>
              <hr />
              <NavLink
                to="/login"
                className="text-decoration-none mb-2 fs-6"
                onClick={() => logout}
              >
                log out
              </NavLink>
              <hr />
            </div>
          </nav>
          <Outlet />
        </div>
      )}
    </>
  );
};
export default SideNav;
