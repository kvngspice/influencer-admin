import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Alert, Spinner, Form, Button, Card } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ManageCampaigns from "./pages/ManageCampaigns";
import ManageUsers from "./pages/ManageUsers";
import AddInfluencer from "./pages/AddInfluencer";
import BookingDetails from './pages/BookingDetails';
import ManageInfluencers from "./pages/ManageInfluencers";
import CampaignDetails from './pages/CampaignDetails';
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response: ${await response.text()}`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and set authenticated state
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.username);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Card style={{ width: '400px' }} className="shadow">
          <Card.Header className="bg-dark text-white text-center">
            <h4>Admin Dashboard Login</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar Navigation */}
        <div className="d-flex flex-column p-4 bg-dark text-white" style={{ width: "280px", height: "100vh" }}>
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`text-white ${activeView === 'dashboard' ? 'active bg-primary p-2 rounded' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/campaigns" 
              className={`text-white ${activeView === 'campaigns' ? 'active bg-success p-2 rounded' : ''}`}
              onClick={() => setActiveView('campaigns')}
            >
              Manage Campaigns
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/add-influencer" 
              className={`text-white ${activeView === 'add-influencer' ? 'active bg-danger p-2 rounded' : ''}`}
              onClick={() => setActiveView('add-influencer')}
            >
              Add Influencer
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/bookings" 
              className={`text-white ${activeView === 'bookings' ? 'active bg-warning p-2 rounded' : ''}`}
              onClick={() => setActiveView('bookings')}
            >
              Manage Bookings
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/users" 
              className={`text-white ${activeView === 'users' ? 'active bg-info p-2 rounded' : ''}`}
              onClick={() => setActiveView('users')}
            >
              Manage Users
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/admin/influencers" 
              className={`text-white ${activeView === 'influencers' ? 'active bg-info p-2 rounded' : ''}`}
              onClick={() => setActiveView('influencers')}
            >
              Manage Influencers
            </Nav.Link>
            <div className="mt-auto">
              <Button 
                variant="outline-light" 
                className="w-100 mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Nav>
        </div>

        {/* Main Content */}
        <Container fluid className="p-4">
          <Routes>
            <Route path="/" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/campaigns" element={<ManageCampaigns />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/add-influencer" element={<AddInfluencer />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="/admin/bookings/:bookingId" element={<BookingDetails />} />
            <Route path="/admin/influencers" element={<ManageInfluencers />} />
            <Route path="/admin/campaigns/:id" element={<CampaignDetails />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
