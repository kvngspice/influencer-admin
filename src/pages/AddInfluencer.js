import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, Card, Spinner, ListGroup, Badge } from "react-bootstrap";
import { FaPlus, FaTimes, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaFacebook, FaLinkedin, FaPinterest, FaSnapchat, FaTwitch, FaExternalLinkAlt } from 'react-icons/fa';

const REGIONS = {
  'Nigeria': [
    'Lagos',
    'Abuja',
    'Port Harcourt',
    'Kano',
    'Ibadan',
    'All Nigeria'
  ],
  'Ghana': [
    'Accra',
    'Kumasi',
    'All Ghana'
  ],
  'Kenya': [
    'Nairobi',
    'Mombasa',
    'All Kenya'
  ],
  'South Africa': [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'All South Africa'
  ]
};

const DEMOGRAPHICS = [
  "13-17",
  "18-24",
  "25-34",
  "35-44",
  "45+"
];

const PLATFORM_CHOICES = [
  { value: "X", label: "X (Twitter)" },
  { value: "Instagram", label: "Instagram" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
];

const AdminAddInfluencer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    primary_platform: '',
    social_platforms: [], // Array to store multiple platforms
    niches: [],
    country: '',
    region: '',
    bio: '',
    engagement_rate: '',
    content_categories: '',
    profile_picture: null,
    base_fee: '',
    demography: '',
  });

  // For adding new platforms
  const [newPlatform, setNewPlatform] = useState({
    platform: '',
    followers_count: '',
    handle: '',
    url: ''
  });

  const [selectedNiche, setSelectedNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const platforms = [
    'Instagram', 
    'TikTok', 
    'YouTube', 
    'Twitter', 
    'Facebook', 
    'LinkedIn', 
    'Pinterest', 
    'Snapchat',
    'Twitch'
  ];

  const niches = [
    'General',
    'Comedy',
    'Fashion', 
    'Beauty', 
    'Lifestyle', 
    'Travel', 
    'Food', 
    'Fitness', 
    'Technology', 
    'Gaming',
    'Business', 
    'Education', 
    'Entertainment', 
    'Health', 
    'Parenting', 
    'Sports', 
    'Art & Design',
    'Music',
    'Others'
  ];

  const countries = Object.keys(REGIONS);

  // Map platform names to their respective icons
  const platformIcons = {
    'Instagram': <FaInstagram />,
    'TikTok': <FaTiktok />,
    'YouTube': <FaYoutube />,
    'Twitter': <FaTwitter />,
    'Facebook': <FaFacebook />,
    'LinkedIn': <FaLinkedin />,
    'Pinterest': <FaPinterest />,
    'Snapchat': <FaSnapchat />,
    'Twitch': <FaTwitch />
  };

  // Add this mapping object
  const platformMapping = {
    'Twitter/X': 'Twitter',
    // Add other mappings if needed
  };

  // Define valid backend platforms
  const validBackendPlatforms = [
    'Instagram', 
    'TikTok', 
    'YouTube', 
    'Twitter', 
    'Facebook', 
    'LinkedIn', 
    'Pinterest', 
    'Snapchat',
    'Twitch'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If country changes, reset region
    if (name === 'country') {
      setFormData({
        ...formData,
        country: value,
        region: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePlatformChange = (e) => {
    const { name, value } = e.target;
    setNewPlatform({
      ...newPlatform,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNiche = () => {
    if (selectedNiche && !formData.niches.includes(selectedNiche)) {
      setFormData({
        ...formData,
        niches: [...formData.niches, selectedNiche]
      });
      setSelectedNiche('');
    }
  };

  const handleRemoveNiche = (nicheToRemove) => {
    setFormData({
      ...formData,
      niches: formData.niches.filter(niche => niche !== nicheToRemove)
    });
  };

  const handleAddPlatform = () => {
    if (newPlatform.platform && newPlatform.followers_count) {
      // Check if platform is valid
      if (!validBackendPlatforms.includes(newPlatform.platform) && 
          newPlatform.platform === 'Twitter/X') {
        // Map Twitter/X to Twitter
        newPlatform.platform = 'Twitter';
      } else if (!validBackendPlatforms.includes(newPlatform.platform)) {
        setError(`Platform "${newPlatform.platform}" is not supported by the system.`);
        return;
      }
      
      if (!formData.social_platforms.some(p => p.platform === newPlatform.platform)) {
        setFormData({
          ...formData,
          social_platforms: [...formData.social_platforms, { ...newPlatform }]
        });
        
        setNewPlatform({
          platform: '',
          followers_count: '',
          handle: '',
          url: ''
        });
      }
    }
  };

  const handleRemovePlatform = (platformToRemove) => {
    setFormData({
      ...formData,
      social_platforms: formData.social_platforms.filter(p => p.platform !== platformToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate form data before submitting
    if (!formData.name) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (formData.social_platforms.length === 0) {
      setError('At least one social media platform is required');
      setLoading(false);
      return;
    }

    if (formData.niches.length === 0) {
      setError('At least one content niche is required');
      setLoading(false);
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      
      // Add required fields
      formDataToSend.append('name', formData.name);
      
      // Set primary platform from the first social platform if available
      if (formData.social_platforms.length > 0) {
        const primaryPlatform = formData.social_platforms[0];
        // Map the platform name if needed
        const platformValue = platformMapping[primaryPlatform.platform] || primaryPlatform.platform;
        formDataToSend.append('platform', platformValue);
        formDataToSend.append('followers_count', primaryPlatform.followers_count);
        if (primaryPlatform.handle) formDataToSend.append('social_media_handle', primaryPlatform.handle);
      } else {
        // Default values if no platform is provided
        formDataToSend.append('platform', 'Instagram');
        formDataToSend.append('followers_count', '0');
      }
      
      // Add all social platforms as JSON
      if (formData.social_platforms.length > 0) {
        try {
          // Make sure each platform object has the correct structure
          const formattedPlatforms = formData.social_platforms.map(platform => ({
            platform: platform.platform,
            followers_count: parseInt(platform.followers_count) || 0,
            handle: platform.handle || '',
            url: platform.url || ''  // Include the URL
          }));
          
          // Convert to JSON string
          const socialPlatformsJson = JSON.stringify(formattedPlatforms);
          console.log("Social platforms JSON:", socialPlatformsJson);
          
          // Add to form data
          formDataToSend.append('social_platforms', socialPlatformsJson);
          
          // Also set the individual URL fields based on the primary platform
          const primaryPlatform = formData.social_platforms[0];
          if (primaryPlatform.url) {
            switch(primaryPlatform.platform) {
              case 'Instagram':
                formDataToSend.append('instagram_url', primaryPlatform.url);
                break;
              case 'TikTok':
                formDataToSend.append('tiktok_url', primaryPlatform.url);
                break;
              case 'YouTube':
                formDataToSend.append('youtube_url', primaryPlatform.url);
                break;
              case 'Twitter':
                formDataToSend.append('twitter_url', primaryPlatform.url);
                break;
              default:
                break;
            }
          }
          
          // Add URLs from additional platforms
          formData.social_platforms.slice(1).forEach(platform => {
            if (platform.url) {
              switch(platform.platform) {
                case 'Instagram':
                  formDataToSend.append('instagram_url', platform.url);
                  break;
                case 'TikTok':
                  formDataToSend.append('tiktok_url', platform.url);
                  break;
                case 'YouTube':
                  formDataToSend.append('youtube_url', platform.url);
                  break;
                case 'Twitter':
                  formDataToSend.append('twitter_url', platform.url);
                  break;
                default:
                  break;
              }
            }
          });
        } catch (e) {
          console.error("Error formatting social platforms:", e);
          // Add an empty array as fallback
          formDataToSend.append('social_platforms', '[]');
        }
      } else {
        // Always include the field, even if empty
        formDataToSend.append('social_platforms', '[]');
      }
      
      // Add niches as a comma-separated string
      if (formData.niches.length > 0) {
        formDataToSend.append('niche', formData.niches.join(','));
      } else {
        formDataToSend.append('niche', 'General');
      }
      
      // Add location information
      let locationString = '';
      if (formData.country) {
        locationString = formData.country;
        if (formData.region) {
          locationString += ` - ${formData.region}`;
        }
        formDataToSend.append('region', locationString);
      } else {
        formDataToSend.append('region', 'Nigeria');
      }
      
      // Add optional fields
      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.gender) formDataToSend.append('gender', formData.gender);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (formData.engagement_rate) formDataToSend.append('engagement_rate', formData.engagement_rate);
      if (formData.content_categories) formDataToSend.append('content_categories', formData.content_categories);
      if (formData.base_fee) formDataToSend.append('base_fee', formData.base_fee);
      if (formData.demography) formDataToSend.append('demography', formData.demography);
      
      // Add profile picture if available
      if (formData.profile_picture) {
        formDataToSend.append('profile_picture', formData.profile_picture);
      }
      
      // Debug: Log the form data being sent
      console.log("Sending form data:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // Try both endpoints
      let response;
      try {
        // First try the admin endpoint
        response = await fetch('http://127.0.0.1:8000/api/admin/influencers/add/', {
          method: 'POST',
          body: formDataToSend
        });
      } catch (e) {
        console.error("Error with admin endpoint, trying general endpoint:", e);
        // If that fails, try the general endpoint
        response = await fetch('http://127.0.0.1:8000/api/influencers/', {
          method: 'POST',
          body: formDataToSend
        });
      }
      
      console.log("Response status:", response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log("Response data:", responseData);
      } catch (e) {
        const text = await response.text();
        console.error("Failed to parse response as JSON:", text);
        throw new Error('Server returned invalid response');
      }
      
      if (!response.ok) {
        if (responseData.details) {
          console.error("Validation errors:", responseData.details);
          // Create a more user-friendly error message
          const errorMessages = Object.entries(responseData.details)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Invalid data:\n${errorMessages}`);
        } else {
          throw new Error(responseData.error || responseData.detail || 'Failed to add influencer');
        }
      }
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        primary_platform: '',
        social_platforms: [],
        niches: [],
        country: '',
        region: '',
        bio: '',
        engagement_rate: '',
        content_categories: '',
        profile_picture: null,
        base_fee: '',
        demography: '',
      });
      setProfilePicturePreview(null);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error adding influencer:', error);
      setError(error.message || 'Failed to add influencer');
    } finally {
      setLoading(false);
    }
  };

  // Remove the problematic useEffect hook
  useEffect(() => {
    // Empty useEffect - no authentication check needed
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Add New Influencer</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Influencer added successfully!</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
      <Form onSubmit={handleSubmit}>
            <h4 className="mb-4">Basic Information</h4>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="profile_picture">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
        </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                {profilePicturePreview && (
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile Preview" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }} 
                  />
                )}
              </Col>
            </Row>
            
            <hr className="my-4" />
            
            <h4 className="mb-4">Social Media Platforms</h4>
            
            {formData.social_platforms.length > 0 && (
              <div className="mb-4">
                <ListGroup>
                  {formData.social_platforms.map((platform, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          {platformIcons[platform.platform] || <span>📱</span>}
                        </span>
                        <div>
                          <strong>{platform.platform}</strong>
                          {platform.handle && <div>@{platform.handle}</div>}
                          {platform.url && (
                            <div>
                              <small>
                                URL: <a href={platform.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                                  <FaExternalLinkAlt className="me-1" size="0.8em" /> Visit Profile
                                </a>
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <Badge bg="primary" className="me-3">
                          {parseInt(platform.followers_count).toLocaleString()} followers
                        </Badge>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemovePlatform(platform.platform)}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
            
            <Card className="mb-4 bg-light">
              <Card.Body>
                <h5 className="mb-3">Add Social Media Platform</h5>
                <Row>
                  <Col md={3} className="mb-3">
                    <Form.Group controlId="new_platform">
          <Form.Label>Platform</Form.Label>
                      <Form.Select
                        name="platform"
                        value={newPlatform.platform}
                        onChange={handlePlatformChange}
                      >
            <option value="">Select Platform</option>
                        {platforms.map(platform => (
                          <option 
                            key={platform} 
                            value={platform}
                            disabled={formData.social_platforms.some(p => p.platform === platform)}
                          >
                            {platform}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="mb-3">
                    <Form.Group controlId="new_followers_count">
                      <Form.Label>Followers Count</Form.Label>
                      <Form.Control
                        type="number"
                        name="followers_count"
                        value={newPlatform.followers_count}
                        onChange={handlePlatformChange}
                        placeholder="e.g. 10000"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="mb-3">
                    <Form.Group controlId="new_handle">
                      <Form.Label>Handle/Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="handle"
                        value={newPlatform.handle}
                        onChange={handlePlatformChange}
                        placeholder="e.g. username"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3} className="mb-2">
                    <Form.Group>
                      <Form.Label>URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="url"
                        value={newPlatform.url}
                        onChange={handlePlatformChange}
                        placeholder="https://example.com/profile"
                      />
                      <Form.Text className="text-muted">
                        Add the full profile URL
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="primary" 
                    onClick={handleAddPlatform}
                    disabled={!newPlatform.platform || !newPlatform.followers_count}
                  >
                    <FaPlus className="me-2" /> Add Platform
                  </Button>
                </div>
              </Card.Body>
            </Card>
            
            <h4 className="mb-4">Content Information</h4>
            
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="niches">
                  <Form.Label>Content Niches</Form.Label>
                  <div className="mb-2">
                    {formData.niches.map(niche => (
                      <Badge 
                        bg="primary" 
                        className="me-2 mb-2 p-2" 
                        key={niche}
                      >
                        {niche}
                        <FaTimes 
                          className="ms-2" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveNiche(niche)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="d-flex">
                    <Form.Select
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      className="me-2"
                    >
                      <option value="">Select Niche</option>
                      {niches.map(niche => (
                        <option 
                          key={niche} 
                          value={niche}
                          disabled={formData.niches.includes(niche)}
                        >
                          {niche}
                        </option>
                      ))}
                    </Form.Select>
                    <Button 
                      variant="outline-primary" 
                      onClick={handleAddNiche}
                      disabled={!selectedNiche || formData.niches.includes(selectedNiche)}
                    >
                      Add
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="engagement_rate">
                  <Form.Label>Average Engagement Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="engagement_rate"
                    value={formData.engagement_rate}
                    onChange={handleChange}
                    placeholder="e.g. 3.5"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group controlId="demography">
                  <Form.Label>Primary Audience Age Range</Form.Label>
                  <Form.Select
                    name="demography"
                    value={formData.demography}
                    onChange={handleChange}
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
              <Col md={6} className="mb-3">
                <Form.Group controlId="base_fee">
                  <Form.Label>Base Fee ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="base_fee"
                    value={formData.base_fee}
                    onChange={handleChange}
                    placeholder="e.g. 100.00"
                  />
        </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </Form.Select>
        </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group controlId="region">
                  <Form.Label>Region</Form.Label>
                  <Form.Select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    disabled={!formData.country}
                  >
                    <option value="">Select Region</option>
                    {formData.country && REGIONS[formData.country]?.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Form.Select>
        </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="content_categories">
                  <Form.Label>Content Categories (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="content_categories"
                    value={formData.content_categories}
                    onChange={handleChange}
                    placeholder="e.g. Tutorials, Reviews, Vlogs"
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
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell brands about this influencer..."
                  />
        </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding Influencer...
                  </>
                ) : 'Add Influencer'}
              </Button>
            </div>
      </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminAddInfluencer;
