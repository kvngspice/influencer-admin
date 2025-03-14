import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal, Form, Row, Col, Badge, Card, ListGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaPinterest, FaSnapchat, FaTwitch, FaEye, FaExternalLinkAlt, FaPlus } from 'react-icons/fa';

const REGIONS = {
  'Nigeria': ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'All Nigeria'],
  'Ghana': ['Accra', 'Kumasi', 'All Ghana'],
  'Kenya': ['Nairobi', 'Mombasa', 'All Kenya'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'All South Africa']
};

const DEMOGRAPHICS = ["13-17", "18-24", "25-34", "35-44", "45+"];

const ManageInfluencers = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState({
    name: '',
    platform: '',
    followers_count: '',
    niche: '',
    social_media_handle: '',
    region: '',
    base_fee: '',
    demography: '',
    bio: '',
    interests: '',
    social_platforms: [],
    instagram_url: '',
    tiktok_url: '',
    youtube_url: '',
    twitter_url: ''
  });
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInfluencer, setViewInfluencer] = useState(null);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/influencers/list/");
      if (!response.ok) throw new Error('Failed to fetch influencers');
      const data = await response.json();
      
      // Add detailed logging for each influencer's social_platforms
      data.forEach(influencer => {
        console.log(`Influencer ${influencer.name} social_platforms:`, influencer.social_platforms);
      });
      
      setInfluencers(data);
    } catch (error) {
      console.error("Error fetching influencers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this influencer?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/influencers/${id}/delete/`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete influencer');
        fetchInfluencers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting influencer:", error);
        setError(error.message);
      }
    }
  };

  const handleEdit = (influencer) => {
    if (!influencer) return;

    const country = Object.keys(REGIONS).find(country => 
      influencer.region && 
      typeof influencer.region === 'string' && 
      influencer.region.includes(country)
    ) || '';

    console.log('Selected influencer for edit:', influencer);

    setSelectedCountry(country);
    setSelectedInfluencer({
      ...influencer,
      name: influencer.name || '',
      platform: influencer.platform || '',
      niche: influencer.niche || '',
      followers_count: influencer.followers_count || 0,
      demography: influencer.demography || '',
      region: influencer.region || '',
      social_media_handle: influencer.social_media_handle || '',
      base_fee: influencer.base_fee || 0,
      interests: influencer.interests || '',
      bio: influencer.bio || '',
      social_platforms: Array.isArray(influencer.social_platforms) ? influencer.social_platforms : [],
      instagram_url: influencer.instagram_url || '',
      tiktok_url: influencer.tiktok_url || '',
      youtube_url: influencer.youtube_url || '',
      twitter_url: influencer.twitter_url || ''
    });
    setShowEditModal(true);
  };

  // Add this function to validate and format URLs
  const formatUrl = (url) => {
    if (!url) return '';
    
    // If the URL doesn't start with http:// or https://, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Selected influencer before submit:", selectedInfluencer);
      
      // Create a clean data object
      const formData = {
        id: selectedInfluencer.id,
        name: selectedInfluencer.name || '',
        platform: selectedInfluencer.platform || '',
        followers_count: parseInt(selectedInfluencer.followers_count) || 0,
        niche: selectedInfluencer.niche || '',
        social_media_handle: selectedInfluencer.social_media_handle || '',
        region: selectedInfluencer.region || '',
        demography: selectedInfluencer.demography || '',
        base_fee: parseFloat(selectedInfluencer.base_fee) || 0,
        interests: selectedInfluencer.interests || '',
        bio: selectedInfluencer.bio || '',
        instagram_url: formatUrl(selectedInfluencer.instagram_url || ''),
        tiktok_url: formatUrl(selectedInfluencer.tiktok_url || ''),
        youtube_url: formatUrl(selectedInfluencer.youtube_url || ''),
        twitter_url: formatUrl(selectedInfluencer.twitter_url || '')
      };
      
      // Process social_platforms to include URLs
      const social_platforms = selectedInfluencer.social_platforms.map(platform => {
        // Make sure each platform has a URL field
        if (!platform.url) {
          // Try to get URL from the main influencer object based on platform type
          switch(platform.platform) {
            case 'Instagram': 
              platform.url = selectedInfluencer.instagram_url || '';
              break;
            case 'TikTok': 
              platform.url = selectedInfluencer.tiktok_url || '';
              break;
            case 'YouTube': 
              platform.url = selectedInfluencer.youtube_url || '';
              break;
            case 'Twitter': 
              platform.url = selectedInfluencer.twitter_url || '';
              break;
            default:
              platform.url = '';
          }
        }
        return platform;
      });
      
      formData.social_platforms = social_platforms;
      
      console.log("Sending data to server:", formData);
      console.log("Social platforms being sent:", JSON.stringify(formData.social_platforms));
      console.log("Social media URLs being sent:", {
        instagram: formData.instagram_url,
        tiktok: formData.tiktok_url,
        youtube: formData.youtube_url,
        twitter: formData.twitter_url
      });

      const response = await fetch(`http://127.0.0.1:8000/api/admin/influencers/${selectedInfluencer.id}/edit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);
      console.log("Social platforms in response:", responseData.social_platforms);
      console.log("Social media URLs in response:", {
        instagram: responseData.instagram_url,
        tiktok: responseData.tiktok_url,
        youtube: responseData.youtube_url,
        twitter: responseData.twitter_url
      });

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update influencer');
      }

      // Success
      fetchInfluencers(); // Refresh the list
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating influencer:", error);
      setError(error.message);
    }
  };

  const handleViewProfile = (influencer) => {
    console.log("Viewing influencer profile:", influencer);
    console.log("Social media URLs:", {
      instagram: influencer.instagram_url,
      tiktok: influencer.tiktok_url,
      youtube: influencer.youtube_url,
      twitter: influencer.twitter_url
    });
    setViewInfluencer(influencer);
    setShowViewModal(true);
  };

  const renderPlatformIcons = (influencer) => {
    console.log(`Rendering platforms for ${influencer.name}:`, {
      platform: influencer.platform,
      social_platforms: influencer.social_platforms
    });
    
    // Platform icon mapping
    const platformIcons = {
      'Instagram': <FaInstagram className="text-danger" />,
      'TikTok': <FaTiktok />,
      'YouTube': <FaYoutube className="text-danger" />,
      'Twitter': <FaTwitter className="text-primary" />,
      'Twitter/X': <FaTwitter className="text-primary" />,
      'Facebook': <FaFacebook className="text-primary" />,
      'LinkedIn': <FaLinkedin className="text-info" />,
      'Pinterest': <FaPinterest className="text-danger" />,
      'Snapchat': <FaSnapchat className="text-warning" />,
      'Twitch': <FaTwitch className="text-purple" />
    };

    // Get URL for primary platform
    const getPlatformUrl = (platform) => {
      switch(platform) {
        case 'Instagram': return influencer.instagram_url;
        case 'TikTok': return influencer.tiktok_url;
        case 'YouTube': return influencer.youtube_url;
        case 'Twitter': case 'Twitter/X': return influencer.twitter_url;
        default: return null;
      }
    };

    // First, show the primary platform
    const primaryPlatformUrl = getPlatformUrl(influencer.platform);
    const primaryPlatformContent = (
      <>
        {platformIcons[influencer.platform] || null}
        <span className="ms-1">{influencer.platform}</span>
        <span className="ms-1">({influencer.followers_count.toLocaleString()})</span>
      </>
    );
    
    const primaryPlatform = (
      <div className="mb-2">
        {primaryPlatformUrl ? (
          <a 
            href={primaryPlatformUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <Badge bg="primary" className="p-2">
              {primaryPlatformContent}
              <FaExternalLinkAlt className="ms-1" size="0.7em" />
            </Badge>
          </a>
        ) : (
          <Badge bg="primary" className="p-2">
            {primaryPlatformContent}
          </Badge>
        )}
      </div>
    );

    // Check if social_platforms exists and is valid
    if (!influencer.social_platforms || !Array.isArray(influencer.social_platforms) || influencer.social_platforms.length === 0) {
      console.log(`No additional platforms for ${influencer.name}`);
      return primaryPlatform;
    }

    // Filter out the primary platform to avoid duplication
    const secondaryPlatforms = influencer.social_platforms.filter(
      platform => platform.platform !== influencer.platform
    );

    console.log(`Secondary platforms for ${influencer.name}:`, secondaryPlatforms);

    if (secondaryPlatforms.length === 0) {
      return primaryPlatform;
    }

    // Render all platforms
    return (
      <div>
        {primaryPlatform}
        <div className="d-flex flex-wrap gap-2">
          {secondaryPlatforms.map((platform, index) => {
            const platformUrl = platform.url || getPlatformUrl(platform.platform);
            const platformContent = (
              <>
                {platformIcons[platform.platform] || null}
                <span className="ms-1">{platform.platform}</span>
                <span className="ms-1">
                  ({parseInt(platform.followers_count).toLocaleString()})
                </span>
              </>
            );
            
            return platformUrl ? (
              <a 
                href={platformUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                key={index}
              >
                <Badge bg="light" text="dark" className="p-2">
                  {platformContent}
                  <FaExternalLinkAlt className="ms-1" size="0.7em" />
                </Badge>
              </a>
            ) : (
              <Badge bg="light" text="dark" key={index} className="p-2">
                {platformContent}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSocialMediaLinks = (influencer) => {
    console.log("Social media URLs for rendering:", {
      instagram: influencer.instagram_url,
      tiktok: influencer.tiktok_url,
      youtube: influencer.youtube_url,
      twitter: influencer.twitter_url
    });
    
    const links = [];
    
    if (influencer.instagram_url) {
      links.push(
        <a 
          href={influencer.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-danger me-2 mb-2"
          key="instagram"
        >
          <FaInstagram className="me-1" /> Instagram
        </a>
      );
    }
    
    if (influencer.tiktok_url) {
      links.push(
        <a 
          href={influencer.tiktok_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-dark me-2 mb-2"
          key="tiktok"
        >
          <FaTiktok className="me-1" /> TikTok
        </a>
      );
    }
    
    if (influencer.youtube_url) {
      links.push(
        <a 
          href={influencer.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-danger me-2 mb-2"
          key="youtube"
        >
          <FaYoutube className="me-1" /> YouTube
        </a>
      );
    }
    
    if (influencer.twitter_url) {
      links.push(
        <a 
          href={influencer.twitter_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline-primary me-2 mb-2"
          key="twitter"
        >
          <FaTwitter className="me-1" /> Twitter
        </a>
      );
    }
    
    return links.length > 0 ? (
      <div className="d-flex flex-wrap">{links}</div>
    ) : (
      <p className="text-muted">No social media links provided</p>
    );
  };

  if (loading) return <div>Loading influencers...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Manage Influencers</h2>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Platforms</th>
            <th>Niche</th>
            <th>Base Fee</th>
            <th>Region</th>
            <th>Demographics</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map(influencer => {
            console.log('Influencer data:', {
              id: influencer.id,
              name: influencer.name,
              base_fee: influencer.base_fee,
              type: typeof influencer.base_fee
            });
            
            return (
              <tr key={influencer.id}>
                <td>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewProfile(influencer);
                    }}
                    className="text-decoration-none"
                  >
                    {influencer.name}
                  </a>
                </td>
                <td>{renderPlatformIcons(influencer)}</td>
                <td>{influencer.niche}</td>
                <td>
                  ${typeof influencer.base_fee !== 'undefined' && influencer.base_fee !== null 
                    ? parseFloat(influencer.base_fee).toLocaleString() 
                    : '0'}
                </td>
                <td>{influencer.region}</td>
                <td>{influencer.demography}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleViewProfile(influencer)}
                  >
                    <FaEye /> View
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(influencer)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(influencer.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* View Profile Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Influencer Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewInfluencer && (
            <div className="influencer-profile">
              <Row>
                <Col md={4}>
                  <div className="text-center mb-3">
                    {viewInfluencer.profile_picture ? (
                      <img 
                        src={viewInfluencer.profile_picture} 
                        alt={viewInfluencer.name}
                        className="img-fluid rounded-circle profile-image"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="profile-placeholder rounded-circle mx-auto d-flex align-items-center justify-content-center"
                        style={{ width: '150px', height: '150px', backgroundColor: '#f8f9fa', fontSize: '3rem', color: '#adb5bd' }}
                      >
                        {viewInfluencer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h4 className="mt-3">{viewInfluencer.name}</h4>
                    <Badge bg="primary" className="mb-2">{viewInfluencer.platform}</Badge>
                    <p className="text-muted">{viewInfluencer.social_media_handle}</p>
                  </div>
                </Col>
                
                <Col md={8}>
                  <Card className="mb-3">
                    <Card.Header>
                      <h5 className="mb-0">Basic Information</h5>
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Niche:</strong> {viewInfluencer.niche}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Followers:</strong> {viewInfluencer.followers_count?.toLocaleString()}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Region:</strong> {viewInfluencer.region}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Demographics:</strong> {viewInfluencer.demography || 'Not specified'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Base Fee:</strong> ${parseFloat(viewInfluencer.base_fee).toLocaleString()}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                  
                  {viewInfluencer.bio && (
                    <Card className="mb-3">
                      <Card.Header>
                        <h5 className="mb-0">Bio</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>{viewInfluencer.bio}</p>
                      </Card.Body>
                    </Card>
                  )}
                  
                  {viewInfluencer.interests && (
                    <Card className="mb-3">
                      <Card.Header>
                        <h5 className="mb-0">Interests</h5>
                      </Card.Header>
                      <Card.Body>
                        <p>{viewInfluencer.interests}</p>
                      </Card.Body>
                    </Card>
                  )}
                  
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">Social Media Platforms</h5>
                    </Card.Header>
                    <Card.Body>
                      {viewInfluencer.social_platforms && 
                       Array.isArray(viewInfluencer.social_platforms) && 
                       viewInfluencer.social_platforms.length > 0 ? (
                        <div>
                          {viewInfluencer.social_platforms.map((platform, index) => {
                            // Get URL for this platform
                            let platformUrl = platform.url;
                            if (!platformUrl) {
                              switch(platform.platform) {
                                case 'Instagram': platformUrl = viewInfluencer.instagram_url; break;
                                case 'TikTok': platformUrl = viewInfluencer.tiktok_url; break;
                                case 'YouTube': platformUrl = viewInfluencer.youtube_url; break;
                                case 'Twitter': case 'Twitter/X': platformUrl = viewInfluencer.twitter_url; break;
                                default: platformUrl = null;
                              }
                            }
                            
                            return (
                              <div key={index} className="mb-2 p-2 border rounded">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <strong>{platform.platform}</strong>
                                    {platform.handle && <span className="ms-2 text-muted">{platform.handle}</span>}
                                  </div>
                                  <div>
                                    <Badge bg="secondary">{parseInt(platform.followers_count).toLocaleString()} followers</Badge>
                                  </div>
                                </div>
                                {platformUrl && (
                                  <a 
                                    href={platformUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-secondary mt-2"
                                  >
                                    <FaExternalLinkAlt className="me-1" /> Visit Profile
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted">No additional platforms</p>
                      )}
                      
                      <div className="mt-4">
                        <h6>Social Media Links</h6>
                        {renderSocialMediaLinks(viewInfluencer)}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowViewModal(false);
              handleEdit(viewInfluencer);
            }}
          >
            Edit Profile
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Influencer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInfluencer && (
            <Form onSubmit={handleEditSubmit}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Basic Information</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedInfluencer.name}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, name: e.target.value})}
                          required
                          placeholder="Full Name"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          value={selectedInfluencer.email || ''}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, email: e.target.value})}
                          placeholder="email@example.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          value={selectedInfluencer.phone || ''}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, phone: e.target.value})}
                          placeholder="+1234567890"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          value={selectedInfluencer.gender || ''}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, gender: e.target.value})}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Social Media Platforms</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="primaryPlatform">
                        <Form.Label>Primary Platform</Form.Label>
                        <Form.Select
                          value={selectedInfluencer.platform}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, platform: e.target.value})}
                          required
                        >
                          <option value="">Select Platform</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Pinterest">Pinterest</option>
                          <option value="Snapchat">Snapchat</option>
                          <option value="Twitch">Twitch</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="followers_count">
                        <Form.Label>Followers Count</Form.Label>
                        <Form.Control
                          type="number"
                          value={selectedInfluencer.followers_count}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, followers_count: e.target.value})}
                          required
                          placeholder="e.g. 10000"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group controlId="social_media_handle">
                        <Form.Label>Social Media Handle</Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedInfluencer.social_media_handle}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, social_media_handle: e.target.value})}
                          placeholder="@username"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {/* Additional Social Platforms Section */}
                  <div className="mb-3">
                    <h6 className="mb-3">Social Media Platforms</h6>
                    
                    {/* Primary Platform */}
                    <div className="p-3 border rounded mb-3 bg-light">
                      <h6 className="mb-2">Primary Platform</h6>
                      <Row>
                        <Col md={3} className="mb-2">
                          <Form.Group>
                            <Form.Label>Platform</Form.Label>
                            <Form.Select
                              value={selectedInfluencer.platform}
                              onChange={e => setSelectedInfluencer({...selectedInfluencer, platform: e.target.value})}
                              required
                            >
                              <option value="">Select Platform</option>
                              <option value="Instagram">Instagram</option>
                              <option value="TikTok">TikTok</option>
                              <option value="YouTube">YouTube</option>
                              <option value="Twitter">Twitter</option>
                              <option value="Facebook">Facebook</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Pinterest">Pinterest</option>
                              <option value="Snapchat">Snapchat</option>
                              <option value="Twitch">Twitch</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={3} className="mb-2">
                          <Form.Group>
                            <Form.Label>Followers</Form.Label>
                            <Form.Control
                              type="number"
                              value={selectedInfluencer.followers_count}
                              onChange={e => setSelectedInfluencer({...selectedInfluencer, followers_count: e.target.value})}
                              required
                              placeholder="e.g. 10000"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3} className="mb-2">
                          <Form.Group>
                            <Form.Label>Handle</Form.Label>
                            <Form.Control
                              type="text"
                              value={selectedInfluencer.social_media_handle || ''}
                              onChange={e => setSelectedInfluencer({...selectedInfluencer, social_media_handle: e.target.value})}
                              placeholder="@username"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3} className="mb-2">
                          <Form.Group>
                            <Form.Label>URL</Form.Label>
                            <Form.Control
                              type="url"
                              value={(() => {
                                switch(selectedInfluencer.platform) {
                                  case 'Instagram': return selectedInfluencer.instagram_url || '';
                                  case 'TikTok': return selectedInfluencer.tiktok_url || '';
                                  case 'YouTube': return selectedInfluencer.youtube_url || '';
                                  case 'Twitter': return selectedInfluencer.twitter_url || '';
                                  default: return '';
                                }
                              })()}
                              onChange={e => {
                                const url = e.target.value;
                                switch(selectedInfluencer.platform) {
                                  case 'Instagram':
                                    setSelectedInfluencer({...selectedInfluencer, instagram_url: url});
                                    break;
                                  case 'TikTok':
                                    setSelectedInfluencer({...selectedInfluencer, tiktok_url: url});
                                    break;
                                  case 'YouTube':
                                    setSelectedInfluencer({...selectedInfluencer, youtube_url: url});
                                    break;
                                  case 'Twitter':
                                    setSelectedInfluencer({...selectedInfluencer, twitter_url: url});
                                    break;
                                  default:
                                    break;
                                }
                              }}
                              placeholder="https://example.com/username"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                    
                    {/* Additional Platforms */}
                    {selectedInfluencer.social_platforms && selectedInfluencer.social_platforms.length > 0 ? (
                      <div className="mb-3">
                        <h6 className="mb-2">Additional Platforms</h6>
                        {selectedInfluencer.social_platforms.map((platform, index) => (
                          <div key={index} className="p-3 border rounded mb-3 bg-light">
                            <Row>
                              <Col md={3} className="mb-2">
                                <Form.Group>
                                  <Form.Label>Platform</Form.Label>
                                  <Form.Select
                                    value={platform.platform}
                                    onChange={e => {
                                      const updatedPlatforms = [...selectedInfluencer.social_platforms];
                                      updatedPlatforms[index].platform = e.target.value;
                                      setSelectedInfluencer({...selectedInfluencer, social_platforms: updatedPlatforms});
                                    }}
                                  >
                                    <option value="">Select Platform</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="TikTok">TikTok</option>
                                    <option value="YouTube">YouTube</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Pinterest">Pinterest</option>
                                    <option value="Snapchat">Snapchat</option>
                                    <option value="Twitch">Twitch</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                              <Col md={3} className="mb-2">
                                <Form.Group>
                                  <Form.Label>Followers</Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={platform.followers_count}
                                    onChange={e => {
                                      const updatedPlatforms = [...selectedInfluencer.social_platforms];
                                      updatedPlatforms[index].followers_count = e.target.value;
                                      setSelectedInfluencer({...selectedInfluencer, social_platforms: updatedPlatforms});
                                    }}
                                    placeholder="e.g. 5000"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3} className="mb-2">
                                <Form.Group>
                                  <Form.Label>Handle</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={platform.handle || ''}
                                    onChange={e => {
                                      const updatedPlatforms = [...selectedInfluencer.social_platforms];
                                      updatedPlatforms[index].handle = e.target.value;
                                      setSelectedInfluencer({...selectedInfluencer, social_platforms: updatedPlatforms});
                                    }}
                                    placeholder="@username"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={3} className="mb-2">
                                <Form.Group>
                                  <Form.Label>URL</Form.Label>
                                  <Form.Control
                                    type="url"
                                    value={platform.url || ''}
                                    onChange={e => {
                                      const updatedPlatforms = [...selectedInfluencer.social_platforms];
                                      updatedPlatforms[index].url = e.target.value;
                                      setSelectedInfluencer({...selectedInfluencer, social_platforms: updatedPlatforms});
                                    }}
                                    placeholder="https://example.com/username"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  const updatedPlatforms = selectedInfluencer.social_platforms.filter((_, i) => i !== index);
                                  setSelectedInfluencer({...selectedInfluencer, social_platforms: updatedPlatforms});
                                }}
                              >
                                Remove Platform
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mb-3">No additional platforms</p>
                    )}
                    
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        const newPlatforms = [...(selectedInfluencer.social_platforms || [])];
                        newPlatforms.push({
                          platform: '',
                          followers_count: '',
                          handle: '',
                          url: ''
                        });
                        setSelectedInfluencer({...selectedInfluencer, social_platforms: newPlatforms});
                      }}
                    >
                      <FaPlus className="me-1" /> Add Platform
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Content & Demographics</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="niche">
                        <Form.Label>Content Niche</Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedInfluencer.niche}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, niche: e.target.value})}
                          required
                          placeholder="e.g. Fashion, Beauty, Tech"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="demography">
                        <Form.Label>Primary Audience Age Range</Form.Label>
                        <Form.Select
                          value={selectedInfluencer.demography}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, demography: e.target.value})}
                          required
                        >
                          <option value="">Select Age Range</option>
                          {DEMOGRAPHICS.map(demo => (
                            <option key={demo} value={demo}>{demo}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group controlId="interests">
                        <Form.Label>Interests</Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedInfluencer.interests || ''}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, interests: e.target.value})}
                          placeholder="e.g. Travel, Food, Sports"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group controlId="bio">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={selectedInfluencer.bio || ''}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, bio: e.target.value})}
                          placeholder="Tell brands about this influencer..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Location & Pricing</h5>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                          value={selectedCountry}
                          onChange={e => {
                            const newCountry = e.target.value;
                            setSelectedCountry(newCountry);
                            if (newCountry) {
                              // Set default region when country changes
                              setSelectedInfluencer({
                                ...selectedInfluencer,
                                region: `All ${newCountry}`
                              });
                            }
                          }}
                          required
                        >
                          <option value="">Select Country</option>
                          {Object.keys(REGIONS).map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="region">
                        <Form.Label>Region</Form.Label>
                        <Form.Select
                          value={selectedInfluencer?.region || ''}
                          onChange={e => setSelectedInfluencer({
                            ...selectedInfluencer,
                            region: e.target.value
                          })}
                          disabled={!selectedCountry}
                          required
                        >
                          <option value="">Select Region</option>
                          {selectedCountry && REGIONS[selectedCountry].map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="base_fee">
                        <Form.Label>Base Fee ($)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={selectedInfluencer.base_fee || ''}
                          onChange={e => setSelectedInfluencer({
                            ...selectedInfluencer,
                            base_fee: e.target.value
                          })}
                          required
                          placeholder="e.g. 100.00"
                        />
                        <Form.Text className="text-muted">
                          Minimum fee for booking this influencer
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="engagement_rate">
                        <Form.Label>Average Engagement Rate (%)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={selectedInfluencer.engagement_rate || ''}
                          onChange={e => setSelectedInfluencer({...selectedInfluencer, engagement_rate: e.target.value})}
                          placeholder="e.g. 3.5"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <div className="d-grid mt-4">
                <Button variant="primary" type="submit" size="lg">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageInfluencers; 