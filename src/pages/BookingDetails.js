import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/bookings/${bookingId}/detail/`);
      if (!response.ok) throw new Error('Failed to fetch booking details');
      const data = await response.json();
      console.log('Booking details:', data); // Debug log
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/bookings/${bookingId}/update-status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      fetchBookingDetails(); // Refresh the booking details
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'primary';
    }
  };

  if (loading) return <div>Loading booking details...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!booking) return <Alert variant="info">No booking found</Alert>;

  return (
    <Container className="mt-4">
      <h2>Booking Details</h2>
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Booking #{booking.id}</h4>
          <Badge bg={getStatusBadgeVariant(booking.status)}>
            {booking.status?.toUpperCase()}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>User Information</h5>
              <p><strong>Name:</strong> {booking.user?.username || 'N/A'}</p>
              <p><strong>Email:</strong> {booking.user?.email || 'N/A'}</p>
              <p><strong>Joined:</strong> {booking.user?.date_joined ? new Date(booking.user.date_joined).toLocaleDateString() : 'N/A'}</p>
            </Col>
            <Col md={6}>
              <h5>Booking Information</h5>
              <p><strong>Created:</strong> {new Date(booking.created_at).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(booking.updated_at).toLocaleString()}</p>
              <p><strong>Amount:</strong> ${booking.amount || 0}</p>
            </Col>
          </Row>

          <hr />

          <Row className="mt-3">
            <Col md={6}>
              <h5>Campaign Details</h5>
              <p><strong>Name:</strong> {booking.campaign?.name || 'N/A'}</p>
              <p><strong>Platform:</strong> {booking.campaign?.platforms?.join(', ') || 'N/A'}</p>
              <p><strong>Budget:</strong> ${booking.campaign?.budget || 0}</p>
              <p><strong>Objective:</strong> {booking.campaign?.objective || 'N/A'}</p>
              <p><strong>Industry:</strong> {booking.campaign?.industry || 'N/A'}</p>
              <p><strong>Region:</strong> {booking.campaign?.region || 'N/A'}</p>
            </Col>
            <Col md={6}>
              <h5>Influencer Details</h5>
              <p><strong>Name:</strong> {booking.influencer?.name || 'N/A'}</p>
              <p><strong>Platform:</strong> {booking.influencer?.platform || 'N/A'}</p>
              <p><strong>Followers:</strong> {booking.influencer?.followers_count?.toLocaleString() || 'N/A'}</p>
              <p><strong>Niche:</strong> {booking.influencer?.niche || 'N/A'}</p>
              <p><strong>Region:</strong> {booking.influencer?.region || 'N/A'}</p>
            </Col>
          </Row>

          <div className="mt-4">
            <h5>Actions</h5>
            <Button 
              variant="success" 
              className="me-2"
              disabled={booking.status === 'confirmed'}
              onClick={() => handleStatusUpdate('confirmed')}
            >
              Confirm Booking
            </Button>
            <Button 
              variant="danger"
              disabled={booking.status === 'cancelled'}
              onClick={() => handleStatusUpdate('cancelled')}
            >
              Cancel Booking
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetails; 