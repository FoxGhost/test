import React, { useEffect, useState } from 'react';
import { Button, Container, FormCheck, Table, Modal } from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import API from '../API';

function Airplane(props) {
  const [nRow, setNRow] = useState(0);
  const [columnLetters, setColumnLetters] = useState([]);
  const [showSeats, setShowSeats] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [numSeats, setNumSeats] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [errorSeats, setErrorSeats] = useState([]);

  //console.log(props);

  useEffect(() => {
    if (props.flightData.length > 0) {
      const type = props.flightData[0].type;
      let numRows = 0;
      let columns = [];

      if (type === 'S') {
        numRows = 15;
        columns = ['A', 'B', 'C', 'D'];
      } else if (type === 'M') {
        numRows = 20;
        columns = ['A', 'B', 'C', 'D', 'E'];
      } else if (type === 'L') {
        numRows = 25;
        columns = ['A', 'B', 'C', 'D', 'E', 'F'];
      }

      setNRow(numRows);
      setColumnLetters(columns);
    }
  }, [props.flightData]);

  let l = useLocation(); 

  useEffect(() => {
    setSelectedSeats([]);
    setNumSeats(0);
  }, [l.pathname]);

  useEffect(() => {
    //console.log('useEffect before if');
    if(dirty === true){
      setDirty(false);
      //console.log('useEffect inside if');
      API.getPlaneInfo(l.pathname)
        .then((result) => {
          props.setFlightData(result);
        });
      setSelectedSeats([]);
      setNumSeats(0);
      //console.log('end use effect: ' + dirty);
    }
  }, [dirty]);


  const freeSeats = props.flightData.filter(s => s.seat_status === 0).length;
  const busySeats = props.flightData.filter(s => s.seat_status === 1).length;

  const rowNumbers = Array.from({ length: nRow }, (_, index) => index + 1);
  
  const toggleSeatsVisibility = () => {
    setDirty(true);
    setShowSeats(!showSeats);
  };

  const handleSeatSelection = (event) => {
    const seatId = event.target.id;
    const isSelected = event.target.checked;

    if (isSelected) {
      setSelectedSeats((prevSeats) => [...prevSeats, seatId]);
    } else {
      setSelectedSeats((prevSeats) => prevSeats.filter((seat) => seat !== seatId));
    }
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
  };

  const closeDelete = () => {
    setShowDelete(false);
  };
  const callDelete = () => {
    setShowDelete(true);
  };

  const pickSeats = () => {
    if(numSeats == 0){
      toast.warn('Select at leats a seat', 
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    else if(numSeats > freeSeats){
      toast.warn('Select max ' + freeSeats + ' seat', 
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    else{
      //console.log('Number of Seats:', numSeats);
      const availableSeats = props.flightData.filter((seat) => seat.seat_status === 0);
      const selected = availableSeats.slice(0, numSeats).map((seat) => `${seat.row}${seat.seat}`);
      //console.log('Selected' + selected);
      setSelectedSeats(selected);
      //console.log('SELECTED SEATS:' + selectedSeats);
      setShowConfirm(true); 
      closePopup();
    } 
  }

  const confirmBooking = () => {
    if(numSeats === selectedSeats.length){
      //console.log('num ok')
      API.bookSeats(props.flightData[0].type, selectedSeats).then(()=>{
        //setSelectedSeats([]);    
        //setDirty(true);

        toast.success('Booking Successfull!', 
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        //console.log('Error booking seats:', error);
        if (error.message.includes('Seat ID:')) {
          const seatId = error.message.split('Seat ID:')[1].trim();
          setErrorSeats(seatId);
          //console.log('Seat already booked:', seatId);
          setSelectedSeats([]);
          toast.error(`Seat(s) ${seatId}  already booked!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            setErrorSeats([]);
          }, 5000);
        } else {
          //console.log('Other error occurred:', error.message);
          toast.error('Error: Not Booked!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",          
          });
        }
      });
      setDirty(true);
      closePopup();
      closeConfirm();
    }
    else{
      //console.log('Error on the number of seats');
      toast.error(`Error`, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored",});
    }
  };

  const booking = () => {
    if(showSeats){
      if(selectedSeats.length !== 0){
        setNumSeats(selectedSeats.length);
        setShowConfirm(true);
      }
      else{
        toast.warn('Please select at least a seat!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
    else{
      openPopup();
    }
  };

  const deleteReservation = () => {
    API.deleteReservation(props.flightData[0].type).then(()=>{ 
      toast.success('Deleting Successfull!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    })
    .catch(()=>{
      toast.error('Error: NOT Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });
    setDirty(true);
    //console.log('After deleting: ' + dirty);
    setSelectedSeats([]);
    closeDelete();
  };
  
  const userHasBooked = props.user && props.flightData.some((seat) => seat.user === props.user.id);
  
  return (
    <Container>
      <h1>
        Free: {freeSeats-selectedSeats.length}{' '} 
        Busy: {busySeats+selectedSeats.length}{' '} 
        Total: {freeSeats + busySeats} 
        {props.loggedIn ? ` - Selected: ${selectedSeats.length}   ` : ""}
        {
          <Button variant='secondary' onClick={toggleSeatsVisibility}>
            {showSeats ? 'Hide Seats' : 'Show Seats'}
          </Button>
        }
        {' '} 
        {props.loggedIn && (
          <Button onClick={userHasBooked ? callDelete : booking} variant={userHasBooked ? "danger" : "primary"}>
            {userHasBooked ? "Delete Reservation" : "Book"}
          </Button>
        )}
      </h1>
      <h2>
        {
          props.loggedIn && props.flightData
          .filter((p) => p.user === props.user.id).length !== 0  ? `Your booking for this plane is: ${props.flightData
            .filter((p) => p.user === props.user.id)
            .map((p) => `${p.row}${p.seat}`)
            .join(', ')}` : 'No booking for this plane'
        }
      </h2>
      {showSeats && (
        <Table bordered>
          <thead>
            <tr>
              <th></th>
              {columnLetters.map((letter) => (
                <th key={letter}>{letter}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowNumbers.map((row) => (
              <tr key={row}>
                <td>{row}</td>
                {columnLetters.map((letter) => {
                  const seatId = `${row}${letter}`;
                  const seat = props.flightData.find((s) => s.row === row && s.seat === letter);
                  const isOtherBooker = seat && seat.user && seat.user !== props.user?.id;
                  const isLoggedBooker = seat && seat.user === props.user?.id;
                  const isDisabled = seat && seat.seat_status === 1 || !props.loggedIn || userHasBooked//hasBooked;
                  const isChecked = seat && seat.seat_status === 1 || selectedSeats.includes(seatId);
                  const isErrorSeat = errorSeats.includes(seatId);
                  //console.log(isErrorSeat);
                  
                  const cellStyle = {
                      backgroundColor:
                      isErrorSeat ? 'red' :
                      (isLoggedBooker ? 'lightskyblue' : (isOtherBooker ? 'lightcoral' : (!props.loggedIn || userHasBooked) ? 'silver' : 'lightgreen')) 
                  };

                  return (
                      <td key={seatId} style={cellStyle}>                      
                      <FormCheck
                        inline
                        type="checkbox"
                        id={seatId}
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={handleSeatSelection}
                      />
                      <label htmlFor={seatId}>{seatId}</label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <>
      {props.loggedIn && showSeats &&(
          <Button onClick={userHasBooked ? callDelete : booking} variant={userHasBooked ? "danger" : "primary"}>
            {userHasBooked ? "Delete Reservation" : "Book"}
          </Button>
        )}
      </>

      <Modal show={showPopup} onHide={closePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Number of Seats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter the number of seats you want to reserve:</p>
          <input type="number" value={numSeats} step={1} min={1} max={freeSeats} onChange={event => setNumSeats(parseInt(event.target.value))} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closePopup}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {pickSeats();}}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirm} onHide={closeConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are going to book these seats, are you sure?</p>
          <p>{selectedSeats.join(', ')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmBooking}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={closeDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are going to delete your booking for this flight, are you sure?</p>
          <p>{selectedSeats.join(', ')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteReservation}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default Airplane;
