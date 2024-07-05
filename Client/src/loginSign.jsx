import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSign = () => {
  const [state, setState] = useState('Login');
  const [formData, setFormData] = useState({
    Username: '',
    Useremail: '',
    Userpassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const login = async () => {
    try {
      console.log('User Login', formData);
      const response = await axios.post('http://localhost:5000/login', {
        Useremail: formData.Useremail,
        Userpassword: formData.Userpassword
      });
      const responseData = response.data;
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('user-name', formData.Useremail);
        navigate('/dashborad');
      } else {
        setMessage(responseData.error);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('An error occurred during login.');
    }
  };

  const sign = async () => {
    try {
      console.log('User Sign up', formData);
      const response = await axios.post('http://localhost:5000/signup', {
        Username: formData.Username,
        Useremail: formData.Useremail,
        Userpassword: formData.Userpassword
      });
      const responseData = response.data;
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('user-name', formData.Useremail);
        navigate('/dashborad');
      } else {
        setMessage(responseData.message);
      }
    } catch (error) {
      console.error('Sign Up Error:');
      setMessage('User Name Already Exist...');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h4 className="card-title text-center mb-4">{state}</h4>
        {message && <p className="text-danger text-center">{message}</p>}
        <form onSubmit={(e) => { e.preventDefault(); state === 'Login' ? login() : sign(); }}>
          {state === 'Sign Up' && (
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="Useremail"
              value={formData.Useremail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              name="Userpassword"
              value={formData.Userpassword}
              onChange={handleChange}
            />
            <span 
              className="position-absolute top-50 end-0 translate-middle-y me-3" 
              onClick={togglePasswordVisibility} 
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
            </span>
          </div>
          <div className="form-group form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
          </div>
          {state === 'Sign Up' ? (
            <div className="text-center mb-3">
              Already have an account? <span style={{ cursor: 'pointer' }} className="text-primary" onClick={() => setState('Login')}>Click here</span>
            </div>
          ) : (
            <div className="text-center mb-3">
              Don’t have an account? <span style={{ cursor: 'pointer' }} className="text-primary" onClick={() => setState('Sign Up')}>Click here</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LoginSign;
