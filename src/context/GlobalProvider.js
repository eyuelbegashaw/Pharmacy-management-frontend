import {createContext, useContext, useState, useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";

//All APIs
import * as authenticationAPI from "../API/authentication";
import * as categoryAPI from "../API/categoryAPI";
import * as drugAPI from "../API/drugAPI";
import * as notificationAPI from "../API/notificationAPI";
import * as supplierAPI from "../API/supplierAPI";
import * as transactionAPI from "../API/transactionAPI";
import {errorMessage} from "../util/error";

//Global context
const GlobalStateContext = createContext();
export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allDrugs, setAllDrugs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);

  const [loading, setLoading] = useState({
    drugsLoading: true,
    transactionsLoading: true,
    suppliersLoading: true,
    categoriesLoading: true,
    notificationsLoading: true,
    allDrugsLoading: true,
    usersLoading: true,
    expiredDrugsLoading: true,
  });

  const resetLoading = () => {
    setLoading({
      drugsLoading: false,
      transactionsLoading: false,
      suppliersLoading: false,
      categoriesLoading: false,
      notificationsLoading: false,
      allDrugsLoading: false,
      usersLoading: false,
      expiredDrugsLoading: false,
    });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      setUser(token);
    } else {
      resetLoading();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Drugs = await drugAPI.getDrug(user.token);
        setDrugs(Drugs);
        setLoading(prevState => ({...prevState, drugsLoading: false}));

        const Categories = await categoryAPI.getCategory(user.token);
        setCategories(Categories);
        setLoading(prevState => ({...prevState, categoriesLoading: false}));

        const Notification = await notificationAPI.getNotification(user.token);
        setNotifications(Notification);
        setLoading(prevState => ({...prevState, notificationsLoading: false}));

        const AllDrugs = await drugAPI.getAllDrug(user.token);
        setAllDrugs(AllDrugs);
        setLoading(prevState => ({...prevState, allDrugsLoading: false}));

        if (!user.isAdmin) {
          const response = await transactionAPI.getDailyTransaction(
            {startDate: new Date(), saleBy: user._id},
            user.token
          );
          setTransactions(response);
          setLoading(prevState => ({...prevState, transactionsLoading: false}));
        } else {
          const response = await transactionAPI.getTransaction(user.token);
          setTransactions(response);
          setLoading(prevState => ({...prevState, transactionsLoading: false}));
        }

        if (user.isAdmin) {
          const Users = await authenticationAPI.getUsers(user.token);
          setUsers(Users);
          setLoading(prevState => ({...prevState, usersLoading: false}));
        }

        const Suppliers = await supplierAPI.getSupplier(user.token);
        setSuppliers(Suppliers);
        setLoading(prevState => ({...prevState, suppliersLoading: false}));

        const ExpiredDrugs = await drugAPI.getExpiredDrug(user.token);
        setExpiredDrugs(ExpiredDrugs);
        setLoading(prevState => ({...prevState, expiredDrugsLoading: false}));
      } catch (error) {
        resetLoading();
        console.log(error);
        toast.error(errorMessage(error));
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const globalState = {
    user,
    setUser,
    drugs,
    setDrugs,
    allDrugs,
    setAllDrugs,
    categories,
    setCategories,
    suppliers,
    setSuppliers,
    transactions,
    setTransactions,
    notifications,
    setNotifications,
    users,
    setUsers,
    expiredDrugs,
    setExpiredDrugs,
    loading,
    setLoading,
  };

  return <GlobalStateContext.Provider value={globalState}>{children}</GlobalStateContext.Provider>;
};
