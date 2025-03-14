import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Alert, Button } from 'react-bootstrap';
import { FaArrowLeft, FaUser, FaCalendar, FaDollarSign, FaBullseye, FaGlobe } from 'react-icons/fa';

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/campaigns/${id}/`);
      if (!response.ok) throw new Error('Failed to fetch campaign details');
      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading campaign details...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!campaign) return <Alert variant="warning">Campaign not found</Alert>;

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Link to="/admin/campaigns" className="btn btn-link text-decoration-none">
          <FaArrowLeft className="me-2" />
          Back to Campaigns
        </Link>
      </div>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2>{campaign.name}</h2>
              <Badge bg={campaign.status === 'Active' ? 'success' : 'secondary'}>
                {campaign.status}
              </Badge>
            </div>
            <div className="text-muted">
              <FaCalendar className="me-1" />
              Created: {new Date(campaign.created_at).toLocaleDateString()}
            </div>
          </div>

          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Campaign Details</h5>
                  <p>
                    <FaBullseye className="me-2" />
                    <strong>Objective:</strong> {campaign.objective}
                  </p>
                  <p>
                    <FaDollarSign className="me-2" />
                    <strong>Budget:</strong> ${campaign.budget}
                  </p>
                  <p>
                    <FaGlobe className="me-2" />
                    <strong>Region:</strong> {campaign.region}
                  </p>
                  <p>
                    <strong>Industry:</strong> {campaign.industry}
                  </p>
                  <p>
                    <strong>Platforms:</strong>{' '}
                    {campaign.platforms?.map(platform => (
                      <Badge key={platform} bg="info" className="me-2">
                        {platform}
                      </Badge>
                    ))}
                  </p>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h5>Target Audience</h5>
                  <p><strong>Demographics:</strong> {campaign.demography}</p>
                  <p><strong>Gender:</strong> {campaign.gender}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <h5>Campaign Owner</h5>
                  <div className="d-flex align-items-center mb-3">
                    <FaUser className="me-2" size={24} />
                    <div>
                      <p className="mb-0"><strong>{campaign.owner?.username || 'N/A'}</strong></p>
                      <small className="text-muted">{campaign.owner?.email || 'No email'}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CampaignDetails; 