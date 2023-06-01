import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Navbar from './Navbar/Navbar';
import Login from './SingUp/Login';
import SignUp from './SingUp/SignUp';
import Wrapper from './Home/Wrapper';
import NewNavbar from './NewNavbar/NewNavbar';
import ProfileMainPage from './Profile/ProfileMainPage';
import Users from './Params/Users';
import UsersDetails from './Params/UsersDetails';
import Practice from './Practice';
import Work from './Work';


function App() {

  return (
    <>
      <Router  basename="/SharePost">
        <Navbar/>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='navbar' element={<NewNavbar />} />
          <Route path='home' element={<Wrapper />} />
          <Route path='signUp' element={<SignUp />} />
          <Route path='login' element={<Login />} />
          <Route path='profile' element={<ProfileMainPage />} />

          <Route path='users' element={<Users />} />
          <Route path='users/:id' element={<UsersDetails />} />

          <Route path='p' element={<Practice />} />
          <Route path='work' element={<Work />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
