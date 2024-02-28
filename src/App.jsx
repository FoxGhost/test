//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import { Navigate  } from "react-router-dom";
import Layout from "./Components/Layout";
import NoPage from "./Components/NoPage";
import Airplane from "./Components/Airplane";
import { useState, useEffect } from 'react'
import API from './API';
import Home from './Components/Home';
import { LoginForm } from "./Components/Authentication";
import Bookings from "./Components/Bookings";


function App() {
  const [flightData, setFlightData] = useState([]);
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
  }

  let l = useLocation(); 

  useEffect(() => {
    if (  l.pathname.includes("/L")||
          l.pathname.includes("/M")||
          l.pathname.includes("/S")) {
    API.getPlaneInfo(l.pathname)
       .then((result) => {
        setFlightData(result);
      });
    }
  }, [l.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser} user={user}/>}>
        <Route index element={<Home/>}/>

        <Route path='/bookings' element={<Bookings user={user}/>}/>

        <Route path='/L' element={<Airplane flightData={flightData} setFlightData={setFlightData} loggedIn={loggedIn} user={user}/>}/>
        <Route path='/M' element={<Airplane flightData={flightData} setFlightData={setFlightData} loggedIn={loggedIn} user={user}/>}/>
        <Route path='/S' element={<Airplane flightData={flightData} setFlightData={setFlightData} loggedIn={loggedIn} user={user}/>}/>

        <Route path='/login' element={
                                      loggedIn? 
                                        <Navigate replace to='/' />
                                        :  
                                        <LoginForm loginSuccessful={loginSuccessful} />} 
        />

        <Route path="*" element={<NoPage />}/>
      </Route>
    </Routes>
  )
}

export default App
