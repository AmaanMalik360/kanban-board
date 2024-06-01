import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../redux/actions/authActions';
import "../configure-password/ConfigurePassword.css"
import { useLocation, useParams } from 'react-router-dom';

const ChangePassword = () => {

    const params = useParams()
    const dispatch = useDispatch();
    const location = useLocation();
    const [password, setPassword] = useState("")
    const [token, setToken] = useState("");

    useEffect(() => {
        // Extract the token from the query parameter when the component mounts
        const searchParams = new URLSearchParams(location.search);
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, [location.search]);

    const handleSubmit = () =>{
        dispatch(changePassword(password, token, params.userId))
    }
    return (
    <div className="body">
        <div className="main-section">
        <input
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
            Send New Password
        </button>
        </div>

    </div>
    )
}

export default ChangePassword
