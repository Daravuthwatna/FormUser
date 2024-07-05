import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios'
import Loading from '../assets/ZKZx.gif'

const View = () => {
  const {id} = useParams();
  const [view, setView] = useState({
    name:'',
    email:'',
    age:''
  })
  const [loading, setLoading] = useState(true);
  const fetchView =async()=>{
    try {
      const response = await axios.get(`http://localhost:5000/get/${id}`);
      setView(response.data)
    } catch (error) {
      console.log('Data Error...');
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchView();
  },[id])
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card" style={{ width: '18rem' }}>
        <div className="card-body">
          {
            loading ? (
              <div className="d-flex justify-content-center">
                <img src={Loading} alt="Loading..." style={{ width: '50px' }} />
              </div>
            ) : (
              <>
                <h4 className="card-title">{view.name}</h4>
                <p className="card-text">{view.email}</p>
                <p className="card-text">{view.age}</p>
              </>
            )
          }
          <Link to="/dashborad" className="btn btn-primary">Return Home</Link>
        </div>
      </div>
    </div>
  );
};

export default View;
