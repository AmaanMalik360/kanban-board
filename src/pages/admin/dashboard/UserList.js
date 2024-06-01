import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./UserList.css"
import { changePermission, fetchPermissions, fetchUserPermissions, fetchUsers } from '../../../redux/actions/adminActions';

const UserList = () => {

  const dispatch = useDispatch();
  const admin = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const users = useSelector(state => state.admin.users)
  const permissions = useSelector(state => state.admin.permissions)
  const userPermissions = useSelector(state => state.admin.userPermissions)

  // Fetch All Users.
  const getUsers = async () => {
    dispatch(fetchUsers(token))
  };

  // Fetch all permissions
  const fetchAllPermissions = async () => {
    dispatch(fetchPermissions(token))
  };

  // Fetch all userPermissions
  const fetchAllUserPermissions = async () => {
    dispatch(fetchUserPermissions(token))
  };

  useEffect(() => {
    async function getData(){
      // Call the getUsers function when the component mounts
      await getUsers();
  
      // Call the fetchAllPermissions(), & fetchAllUserPermissions() function when the component mounts
      await fetchAllPermissions();
      await fetchAllUserPermissions();
    }

    getData()
  }, []);
  
  const handlePermissionChange = async (userId, permissionId, e) => {
    dispatch(changePermission(token, admin.id, userId, permissionId, users, userPermissions))
  };
    
  return (
    <>
    <div className='dashboard'>
      <div className='UserList'>
        <h2 className='heading'>All Users</h2>
        <table className="table"> 
        <thead>
            <tr>
                <th className="th center l">User</th>
                <th className="th center l" colSpan="3">Permissions</th>
            </tr>
            <tr>
                <th className="th center"></th>
                <th className="th center">Write</th>
                <th className="th center">Edit</th>
                <th className="th center">Delete</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user,i) => (
              !user.is_admin?
              <>
              <tr key={user.id}>
                <td className="td" key={i}> 
                  <div style={{ cursor: 'pointer' }} className='center'>
                    {user.email}
                  </div>
                </td>
                
                {permissions?.map((permission, ii) =>
                  <>                 
                    <td className="td center"> 
                    <div key={ii}>
                      <input
                        style={{cursor: 'pointer'}}
                        type='checkbox'
                        checked={ userPermissions.some((uP) => uP.user_id === user.id && uP.permission_id === permission.id)}
                        onChange={(e) => handlePermissionChange(user.id, permission.id, e)}
                      />
                    </div>
                    </td>
                  </>
                )}
              </tr>
              </>:
              <></>
            ))}
        </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default UserList;                  