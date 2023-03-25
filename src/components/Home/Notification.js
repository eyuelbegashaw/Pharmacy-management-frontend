import {toast} from "react-toastify";
import {useContext} from "react";
import {userContext} from "../../context/globalState";
import * as NotificationAPI from "../../API/notificationAPI";

const Notification = ({notifications, setNotifications}) => {
  const {user} = useContext(userContext);
  const handleReadNotification = async () => {
    try {
      await NotificationAPI.readNotification(user.token);
      setNotifications([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await NotificationAPI.clearNotification(user.token);
      setNotifications([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="notification-icon">
      <div className="dropdown">
        <button
          className="dropdown-toggle theme px-3 text-white"
          type="button"
          id="notificationDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-bell bell pe-2"></i>
          {notifications && notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}
        </button>

        <ul
          className="dropdown-menu dropdown-menu-end p-3 notification-menu"
          aria-labelledby="notificationDropdown"
        >
          {notifications &&
            notifications.map((notification, index) => (
              <li key={index} className={`notification-item ${notification.read ? "read" : ""}`}>
                <p>{notification.message}</p>
                <hr />
              </li>
            ))}
          {notifications && notifications.length === 0 && (
            <li className="dropdown-item">No notifications.</li>
          )}
          {notifications && notifications.length > 0 && (
            <li>
              <button className="dropdown-item" onClick={handleReadNotification}>
                Mark all as read
              </button>
            </li>
          )}
          {user && user.isAdmin && (
            <li>
              <button className="dropdown-item" onClick={handleDeleteNotification}>
                Delete All Notification
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
