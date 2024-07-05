import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
  const [userDetail, setUserDetail] = useState({
    name: '',
    email: '',
    age: ''
  });

  const ChangeHandler = (e) => {
    setUserDetail({ ...userDetail, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetail)
      });
      if (response.ok) {
        setUserDetail({
          name: '',
          email: '',
          age: ''
        });
      } else {
        alert('Error adding user.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const notify = () => toast("Add Successfuly!");

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
      <div className="card shadow-lg p-3 mb-5 bg-white rounded" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Form</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={userDetail.name}
                onChange={ChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={userDetail.email}
                onChange={ChangeHandler}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Age</label>
              <input
                className="form-control"
                type="number"
                name="age"
                value={userDetail.age}
                onChange={ChangeHandler}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" onClick={notify} className="btn btn-primary btn-block me-2">Add</button>
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

export default Create;
