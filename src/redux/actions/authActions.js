import axios from 'axios';
import { BASE_URL } from '../../backendlink';
import { showToast } from '../../components/common/toasts/Toast';

export const useLogin = () => {
    const signin = (email, password) => async (dispatch) => {
      try {
        dispatch({ type: 'LOGIN_REQUEST' });
  
        // Make an HTTP request to your backend
        const response = await axios.post(`${BASE_URL}/users/signin`, {
          email,
          password,
        });

        // response = response.data
        console.log(response.status);  
        console.log(response.data);  
        // Assuming your backend returns a success message on successful signin
        if (response.status === 200) 
        {
          const {user, token} = response.data;
          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('token', token)

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user, token
            },
          });
  
          return { success: true, user, message : response.data.message };
        } 
        else 
        {
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: { error: response.data.message },
          });
          return { success: false, error: response.data.message };
        }
      } 
      catch (error) {
        console.error('Error during signin:', error);
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: { error: 'Error during signin' },
        });
        return { success: false, error: 'Error during signin' };
      }
    };
  
    return signin;
  };


export const signout = () =>{
    return dispatch => {
      
      dispatch({ type:'CLEAR_TICKETS' })
      
      dispatch({ type:'LOGOUT_REQUEST' })
      
      localStorage.clear();
      dispatch({
        type:'LOGOUT_SUCCESS'
      })
      
    }
    
}
  
export const configurePassword = (email) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${BASE_URL}/users/configure-password`, {
        email
      });
      
      if(response.status === 201)
      {
        console.log(response.data)
        showToast(response.data.message, 'success')    
      }
      else
      {
        showToast(response.data.message, 'error')    
      }
    } 
    catch (error) {
      console.log(error)
      showToast('Error while sending', 'error') 
    }
  } 
}

export const changePassword = (password, token,userId) => {
    return async dispatch => {
      try {
        const response = await axios.post(`${BASE_URL}/users/change-password/${userId}`, {
          password,
          token
        });
        if(response.status === 201)
        {
          console.log(response.data)
          showToast(response.data.message, 'success')    
        }
        else
        {
          showToast(response.data.message, 'error')    
        }
      } 
      catch (error) {
        showToast('Error while sending', 'error') 
      }
    } 
}

