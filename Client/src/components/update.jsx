import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Update = () => {
  const { id } = useParams();
  const [updateDetail, setUpdateDetail] = useState({
    name: '',
    email: '',
    age: ''
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get/${id}`);
      setUpdateDetail(response.data);
    } catch (error) {
      console.log('Data Error:', error);
    }
  };

  const handleChange = (e) => {
    setUpdateDetail({ ...updateDetail, [e.target.name]: e.target.value });
  };

  const notify = () => toast("Update Successfuly!");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/update/${id}`, updateDetail);
      if (response.status === 200) {
        return(
          <div></div>
        )
      } else {
        alert('Error updating user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
      <div className="card shadow-lg p-3 mb-5 bg-white rounded" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Form Update</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={updateDetail.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={updateDetail.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Age</label>
              <input
                className="form-control"
                type="number"
                name="age"
                value={updateDetail.age}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" onClick={notify} className="btn btn-primary btn-block me-2">Update</button>
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
                transition: Bounce
              />
              <Link to='/dashborad' className="btn btn-secondary btn-block">Back</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Update;
