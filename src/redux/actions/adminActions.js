import axios from "axios";
import { BASE_URL } from "../../backendlink";
import { showToast } from "../../components/common/toasts/Toast";

export const fetchUsers = (token) =>{    
    return async (dispatch) => {
      try {
        dispatch({ type: "USERS_REQUEST" });

        const response = await axios.get(`${BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const { users } = response.data;
          dispatch({ type: "USERS_SUCCESS", payload: users });
        } 
        else 
        {
          dispatch({
            type: "USERS_FAILURE", payload: { error: response.data.message }
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
}
export const fetchPermissions = (token) =>{    
    return async (dispatch) => {
      try {
        dispatch({ type: "PERMISSIONS_REQUEST" });

        const response = await axios.get(`${BASE_URL}/admin/permissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const { permissions } = response.data;
          dispatch({ type: "PERMISSIONS_SUCCESS", payload: permissions });
        } 
        else 
        {
          dispatch({
            type: "PERMISSIONS_FAILURE", payload: { error: response.data.message }
          });
        }
      } catch (error) {
        console.error("Error fetching Permissions:", error);
      }
    };
}

export const fetchUserPermissions = (token) =>{    
    return async (dispatch) => {
      try {
        dispatch({ type: "USER_PERMISSIONS_REQUEST" });

        const response = await axios.get(`${BASE_URL}/admin/user-permissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          const { userPermissions } = response.data;
          dispatch({ type: "USER_PERMISSIONS_SUCCESS", payload: userPermissions });
        } 
        else 
        {
          dispatch({
            type: "USER_PERMISSIONS_FAILURE", payload: { error: response.data.message }
          });
        }
      } 
      catch (error) {
        console.error("Error fetching User Permissions:", error);
      }
    };
}

export const changePermission = (token, adminId, userId, permissionId, users, userPermissions) =>{    
    return async (dispatch) => {
        try 
        {
            // Check if the user is an admin
            const userToUpdate = users.find((obj) => obj.id === userId);
            
            if (userToUpdate && userToUpdate.is_admin) {
                // If the user is an admin, notify and return without making changes
                showToast('Cannot change Admin Permissions.', 'info');
                return;
            }
            // Make a request to the backend to update user permission
            dispatch({ type: "CHANGE_PERMISSIONS_REQUEST" });
            
            const response = await axios.patch(
                `${BASE_URL}/admin/change-permission/${adminId}`,
                { userId: userId, permissionId: permissionId },
                {
                headers: 
                    {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
     
            if (response.status === 200) 
            {
                // Handle success if needed
                // showToast(response.data.message, 'success');
                // Now do changes in frontend also to reflect changes. 
                // Check if the userPermission already exists
                const existingUserPermissionIndex = userPermissions.findIndex(
                (uP) => uP.user_id === userId && uP.permission_id === permissionId
                );
                
                if (existingUserPermissionIndex !== -1) {
                    // If the userPermission exists, remove it from the userPermissions state
                    const updatedUserPermissions = [...userPermissions];
                    updatedUserPermissions.splice(existingUserPermissionIndex, 1);
                    dispatch({ type: "CHANGE_PERMISSIONS_SUCCESS", payload: updatedUserPermissions });
                } 
                else 
                {
                    // If the userPermission does not exist, add it to the userPermissions state
                    const newUserPermission = {
                        user_id: userId,
                        permission_id: permissionId,
                    };
                    const updatedUserPermissions = [...userPermissions, newUserPermission]
                    dispatch({ type: "CHANGE_PERMISSIONS_SUCCESS", payload: updatedUserPermissions });
                }
            } 
            else 
            {
                showToast(response.data.message, 'error');
                dispatch({
                    type: "CHANGE_PERMISSIONS_FAILURE", payload: { error: response.data.message }
                });
            }
        } 
        catch (error) 
        {
            showToast('Error handling permission change:', 'error');
        }
    };
} 

export const addPhase = (name) => {
  return async (dispatch) => {
    try {
      let response = await axios.post(`${BASE_URL}/admin/phases`, {
        name
      });
      
      if(response.status == 201)
      {
        console.log(response.data)
        showToast(response.data.message, 'success')    
      }
      else if(response.status == 409)
      {
        showToast(response.data.message, "info")    
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