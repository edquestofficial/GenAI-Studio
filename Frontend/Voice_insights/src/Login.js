import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import "./Login.css"; // For enhanced styling

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { state } = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        login().then(() => {
            navigate(state?.path || "/");
        });
    };

    return (
        <div className='container-fluid h-100'>
           <div class="d-flex flex-row justify-content-center align-items-center" style={{height: '100%'}}>
                <form className='login-container' onSubmit={handleLogin}>
                    <div class="mb-3 row col-12">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" />
                    </div>
                    <div class="mb-3 row col-12">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id='password' />
                    </div>
                    <button type="submit" class="btn btn-info">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login