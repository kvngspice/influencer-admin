import React, { useState, useEffect } from "react";
import { Container, Card, Badge, Button, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUser, FaCalendar, FaDollarSign } from "react-icons/fa";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/bookings/");
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/bookings/${bookingId}/update-status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update booking status');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error updating booking:", error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Link to="/admin/add-influencer" className="text-decoration-none">
            <Card className="text-center p-3">
              <h5>Add Influencer</h5>
            </Card>
          </Link>
        </Col>
        <Col md={3}>
          <Link to="/admin/campaigns" className="text-decoration-none">
            <Card className="text-center p-3">
              <h5>Manage Campaigns</h5>
            </Card>
          </Link>
        </Col>
        <Col md={3}>
          <Link to="/admin/influencers" className="text-decoration-none">
            <Card className="text-center p-3">
              <h5>Manage Influencers</h5>
            </Card>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3>Recent Bookings</h3>
          {bookings.map(booking => (
            <Card key={booking.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5>Booking #{booking.id}</h5>
                    <Badge bg={
                      booking.status === 'pending' ? 'warning' :
                      booking.status === 'approved' ? 'success' :
                      'danger'
                    }>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-muted">
                    <FaCalendar className="me-1" />
                    {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>

                <Row className="mt-3">
                  <Col md={4}>
                    <h6>Influencer</h6>
                    <p className="mb-1">
                      <strong>{booking.influencer.name}</strong>
                    </p>
                    <p className="mb-1">{booking.influencer.platform}</p>
                    <p className="mb-1">
                      {booking.influencer.followers_count.toLocaleString()} followers
                    </p>
                  </Col>

                  <Col md={4}>
                    <h6>Campaign</h6>
                    <Link to={`/admin/campaigns/${booking.campaign.id}`} className="text-decoration-none">
                      <p className="mb-1">
                        <strong>{booking.campaign.name}</strong>
                      </p>
                      <p className="mb-1">{booking.campaign.objective}</p>
                      <p className="mb-1">
                        <FaDollarSign className="me-1" />
                        {booking.campaign.budget}
                      </p>
                    </Link>
                  </Col>

                  <Col md={4}>
                    <h6>Created By</h6>
                    <p className="mb-1">
                      <FaUser className="me-1" />
                      {booking.user ? booking.user.username : 'N/A'}
                    </p>
                    <p className="mb-1">{booking.user ? booking.user.email : 'N/A'}</p>
                  </Col>
                </Row>

                {booking.status === 'pending' && (
                  <div className="mt-3">
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleStatusUpdate(booking.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
