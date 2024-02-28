import 'bootstrap/dist/css/bootstrap.min.css';
import {AirplaneEnginesFill, TicketPerforatedFill} from 'react-bootstrap-icons'
import {Container, Navbar, Row, Col, Button} from 'react-bootstrap'

import { Link, Outlet, useNavigate } from "react-router-dom";

import { ToastContainer } from 'react-toastify';

import API from '../API';
import Sidebar from './Sidebar';

function TopBar(props) {
  
    const navigate = useNavigate();
    const login = () => {
      navigate('/login');
    }
  
    const doLogOut = async () => {
      await API.logOut();
      props.setLoggedIn(false);
      props.setUser(undefined);
      navigate('/');
    }

    const bookings = () => {
      navigate('/bookings');
    }

    return (
        <Navbar bg='primary' variant='dark'>
          <Container>
          <AirplaneEnginesFill color='white' width="32" height="32" />

            <Link to='/' className='navbar-brand mx-auto' color='white'>
              AirPoliTo
            </Link>
            <>
              {props.loggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '16px', color: 'white' }}>Welcome {props.user.name}</span>
                  
                  <Button variant='light' style={{ marginRight: '8px' }} onClick={bookings}>
                    Your Tickets{' '}
                    <TicketPerforatedFill/>
                  </Button>
                  
                  <Button variant="warning" onClick={doLogOut}>
                    Logout
                  </Button>
                </div>
                ) : (
                <Button variant="light" onClick={login}>
                  Login
                </Button>
              )}
            </>
          </Container>
        </Navbar>
    );
  }

  const Layout = (props) => {
        
    return (
        <>
          <TopBar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} setUser={props.setUser} user={props.user}/>
            <Row>
                <Col md="auto">
                    <Sidebar/>
                </Col>
                <Col>
                    <Outlet/>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
              </Col>
            </Row>
        </>
  )
};

export default Layout;