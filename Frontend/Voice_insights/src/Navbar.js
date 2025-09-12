import React from 'react'
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./useAuth";
import "./Navbar.css";

function Navbar() {
    const { authed, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="App-header">
            <div className="navbar-center mx-5">
                <ul className="nav-links">
                    {authed && <li>
                        <Link to="/">Dashboard</Link>
                    </li>}
                    {!authed && <li>
                        <Link to="/login">Login</Link>
                    </li>}
                    {authed && 
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>}
                </ul>
            </div>
        </header>
    )
}

export default Navbar