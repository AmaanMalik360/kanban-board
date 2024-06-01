import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addPhase } from '../../../redux/actions/adminActions';

const Phases = () => {
    const dispatch = useDispatch();
    const [phase, setPhase] = useState("")

    const handleSubmit = () =>{
        dispatch(addPhase(phase))
    }
    
    return (
    <div className="body">
        <div className="main-section">
        <input
            type="email"
            required
            placeholder="Enter Phase Name"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
        />

        <button onClick={handleSubmit}>
            Add New Phase
        </button>
        </div>

    </div>
    );
}

export default Phases