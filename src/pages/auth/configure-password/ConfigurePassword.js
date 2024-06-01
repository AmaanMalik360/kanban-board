import React, { useState } from "react";
import "./ConfigurePassword.css"
import { useDispatch } from "react-redux";
import { configurePassword } from "../../../redux/actions/authActions";

const ConfigurePassword = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState("")

    const handleSubmit = () =>{
        dispatch(configurePassword(email))
    }
    
    return (
    <div className="body">
        <div className="main-section">
        <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSubmit}>
            Send Link
        </button>
        </div>

    </div>
    );
};

export default ConfigurePassword;
