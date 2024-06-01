import React, { useState } from 'react'
import { useDispatch} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../../../redux/actions/authActions';
import { showToast } from '../../../components/common/toasts/Toast';
import {IoMdKey} from 'react-icons/io'
import "./Signin.css"

const Signin = () => {

    const move = useNavigate();
    const dispatch = useDispatch();
    const signin = useLogin()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setPending(true);
  
      try {
        // Dispatch the signin action and get the response from the backend
        const response = await dispatch(signin(email, password));
  
        if (response && response.success) {
  
          // Assuming the backend returns a success message on successful signin
          showToast(response.message, 'success');
          setPending(false);
  
          // Redirect to admin dashboard if user is admin
          if (response.user.is_admin) {
            move('/userlist');
          } 
          else{
            // Redirect to movies list
            move('/user-board');
          }
        } 
        else 
        {
          showToast(response.error || 'Invalid email or password', 'error');
          setPending(false);
        }
      } 
      catch (error) 
      {
        console.error('Error during signin:', error);
        setPending(false);
        showToast('Error during signin', 'error');
      }
    };
      
    return (
      <>
        <div className='create'>
            <h2>Sign in </h2>

            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    required
                    placeholder='Email'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <input
                    type='password'
                    required
                    placeholder='Password'
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
                <div className='signin-options'>
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      className='custom-checkbox'
                      value={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      />
                    <p htmlFor="rememberMeCheckbox">Remember Me</p>
                  </div>

                  <Link to="/configure-password" className='forgot-password'>
                    <IoMdKey color='white'/>
                    <p>Forgot Password?</p>
                  </Link>

                </div>
                {!pending && <button >Login</button>}
                {pending && <button >Logging in.....</button>}
            </form>
        </div>      
         
      </>
    )
}

export default Signin;