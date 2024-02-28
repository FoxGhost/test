import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Modal } from 'react-bootstrap';
import { Trash3Fill } from 'react-bootstrap-icons'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import API from '../API';

function Bookings(props) {
  const [booked, setBooked] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteType, setDeleteType] = useState('');



  let l = useLocation();

  useEffect(() => {
    API.getBookings().then((result) => {
      const filteredBookings = result.filter((p) => p.user === props.user.id);
      setBooked(filteredBookings);
    });
  }, [l.pathname]);

  useEffect(() => {
    if (dirty === true) {
      API.getBookings().then((result) => {
        const filteredBookings = result.filter((p) => p.user === props.user.id);
        setBooked(filteredBookings);
      });
      setDirty(false);
    }
  }, [dirty]);

  const openDelete = (type) => {
    setDeleteType(type);
    setShowDelete(true);
  };

  const closeDelete = () => {
    setShowDelete(false);
  };

  const deleteReservation = () => {
    //console.log('Bookings type: ' + deleteType);
    API.deleteReservation(deleteType)
      .then(() => {
        toast.success('Deleting Successful!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .catch(() => {
        toast.error('Error: Not Deleted!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      });
    setDirty(true);
    closeDelete();
  };

  //console.log(booked);
  return (
    <Container>
      <h1>Bookings</h1>
      {booked.length > 0 ? (
        <Table bordered>
            <thead>
                <tr>
                <th>Type</th>
                <th>Seat IDs</th>
                <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {booked.reduce((acc, booking) => {
                    const existingType = acc.find((item) => item.type === booking.type);
                    if (existingType) {
                        existingType.seats.push(`${booking.row}${booking.seat}`);
                    } 
                    else {
                        acc.push({
                            type: booking.type,
                            seats: [`${booking.row}${booking.seat}`],
                        });
                    }
                    return acc;
                }, []).map((booking) => (
                <tr key={booking.type}>
                    <td>
                      {booking.type === 'L' && 'International'}
                      {booking.type === 'M' && 'Regional'}
                      {booking.type === 'S' && 'Local'}
                    </td>
                    <td>{booking.seats.join(', ')}</td>
                    <td>
                        <Button variant='danger' onClick={() => openDelete(booking.type)}>
                            <Trash3Fill></Trash3Fill>
                        </Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
      ) : (
        <p>No bookings found.</p>
      )}

      <Modal show={showDelete} onHide={closeDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are going to delete your booking for this flight, are you sure?</p>
          <p>Flight: {' '}
                      {deleteType === 'L' && 'International'}
                      {deleteType === 'M' && 'Regional'}
                      {deleteType === 'S' && 'Local'}
          </p>
          <p>Seat(s):{' '}{booked.filter(f => f.type === deleteType).map(f => f.row+f.seat).join(', ')}</p>
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

export default Bookings;
