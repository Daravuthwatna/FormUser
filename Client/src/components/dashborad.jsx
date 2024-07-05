import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../assets/ZKZx.gif'

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [isVisible, setIsVisible] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    if (isVisible < filteredUsers.length) {
      setIsVisible(prev => prev + 6);
    } else {
      notify("No more users to display");
    }
  };

  const notify = (message) => toast(message);

  const removeUser = async (id) => {
    try {
      await axios.post('http://localhost:5000/removeuser', { id });
      await fetchUsers();
    } catch (error) {
      console.log("Delete Error...");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/alluser');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const name = localStorage.getItem('user-name');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log('Fetch History Error...');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleLogout();
      notify("You have been automatically logged out due to inactivity");
    },10000); // 8 * 60 * 60 * 1000 Auto logout after 8 hours of inactivity 

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout();
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keypress", resetTimeout);

    return () => {
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keypress", resetTimeout);
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-name');
    window.location.replace('/');
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.age.toString().toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dashboard - {userName}</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control me-3"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <div className="input-group-append">
              <Link to='/create' className="btn btn-primary text-white me-3 text-decoration-none">Add</Link>
            </div>
            <div>
              <button onClick={handleLogout} className="btn btn-danger ml-3">Log Out</button>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center">
          <img src={Loading} alt="Loading..." style={{ width: '100px' }} />
        </div>
      ) : (
        <div>
          <table className="table table-hover table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">Email</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
                <th scope="col">View</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.slice(0, isVisible).map((user, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link className="btn btn-warning btn-sm" to={`/update/${user.id}`}>Update</Link>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeUser(user.id)}>Delete</button>
                  </td>
                  <td>
                    <Link className="btn btn-primary btn-sm" to={`/view/${user.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary m-3 btn-sm rounded-pill shadow" onClick={handleLoadMore}>Show More</button>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Dashboard;
