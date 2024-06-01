import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Signup from './pages/auth/signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signin from './pages/auth/signin/Signin';
import NotFound from './routes/NotFound';
import Navbar from './components/common/navbar/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import UserList from './pages/admin/dashboard/UserList';
import Permissions from './routes/Permissions';
import Footer from './components/common/footer/Footer';
import ConfigurePassword from './pages/auth/configure-password/ConfigurePassword';
import ChangePassword from './pages/auth/change-password/ChangePassword';
import Phases from './pages/admin/phases/Phases';
import UserBoard from './pages/user/UserBoard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
          <div className="content">
              <Routes>
                <Route path='/' element={<Signup/>}></Route>
                <Route path='/signin' element={<Signin/>}></Route>              
                <Route path='/configure-password' element={<ConfigurePassword/>}>
                </Route>              
                <Route path='/change-password/:userId' element={<ChangePassword/>}>
                </Route>              
                
                <Route element={<PrivateRoute/>}>
                  {/* <Route path='/movies' element={<MoviesList/>}></Route> */}
                  <Route path='/user-board' element={<UserBoard/>}></Route>
                  
                  <Route element={<Permissions perProp={['Admin']} />}>            
                    <Route path='/userlist' element={<UserList/>}/>
                    <Route path='/phases' element={<Phases/>}/>
                  </Route>
                  
                </Route>
                <Route path='*' element={<NotFound/>}/>
              </Routes>
          </div>       
        <ToastContainer />
      </div>
        <Footer/>
    </Router>
  );
}
export default App;