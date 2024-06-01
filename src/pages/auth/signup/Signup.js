import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import { BASE_URL } from '../../../backendlink';
import { showToast } from '../../../components/common/toasts/Toast';

const Signup = () => {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const move = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    try {
      let is_admin = false;

      const response = await axios.post(`${BASE_URL}/users/signup` , {
        name,
        email,
        password,
        is_admin
      });
      if(response.status === 201)
      {
        // Notify user
        showToast(response.data.message, 'success');
        setPending(false);
        
        // If signup is successful, move to the "/signin" route
        move('/signin');
        
      }
      else{
        // If an error occurs, handle it here
        console.error('Error during signup:');
        setPending(false);
        
        // Notify user
        showToast(response.data.message, 'error');
      }
    } 
    catch (error) 
    {
      // If an error occurs, handle it here
      console.error('Error during signup:', error);
      setPending(false);

      // Notify user
      showToast('Error during signup', 'error');
    }
  };

  return (
    <>
    <div className='create'>
      <h2>Sign up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          required
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        <input
          type='email'
          required
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          required
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
        
        {!pending && <button>Signup</button>}
        {pending && <button disabled>Signing Up.....</button>}
      </form>
    </div>

    </>
  );
};

export default Signup;
