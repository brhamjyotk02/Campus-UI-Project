import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";
export default function Navbar(){
  const {isAuthenticated,user,logout}=useAuth(); const navigate=useNavigate();
  return <nav className="navbar"><div className="navbar-container">
    <Link to="/" className="navbar-logo"><span className="logo-icon">C</span><span>CampusHub AI</span></Link>
    <div className="navbar-links"><a href="/#features">Features</a><a href="/#how-it-works">How It Works</a>{isAuthenticated&&<Link to="/dashboard">Dashboard</Link>}</div>
    <div className="navbar-actions">{isAuthenticated?<><span className="navbar-user">Hi, {user?.name}</span><button className="btn btn-outline" onClick={()=>{logout();navigate("/");}}>Logout</button></>:<><Link to="/login" className="btn btn-outline">Login</Link><Link to="/register" className="btn btn-primary">Get Started</Link></>}</div>
  </div></nav>
}
