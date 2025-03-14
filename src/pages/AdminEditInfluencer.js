import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const AdminEditInfluencer = ({ refreshInfluencers }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  const [influencerData, setInfluencerData] = useState({
    name: "",
    platform: "",
    niche: "",
    followers_count: "",
    profile_picture: "",
    social_media_handle: "",
    interests: "",
    demography: "",
    instagram_url: "",
    tiktok_url: "",
    youtube_url: "",
    twitter_url: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch current influencer data
    fetch(`http://127.0.0.1:8000/api/influencers/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched influencer data:", data);
        setInfluencerData(data);
      })
      .catch((error) => {
        console.error("Error fetching influencer details:", error);
        setError("Failed to load influencer data");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfluencerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Prepare the data
      const dataToSend = {
        ...influencerData,
        followers_count: parseInt(influencerData.followers_count),
        profile_picture: influencerData.profile_picture || null,
        social_media_handle: influencerData.social_media_handle || '',
        interests: influencerData.interests || '',
        demography: influencerData.demography || '',
        instagram_url: influencerData.instagram_url || '',
        tiktok_url: influencerData.tiktok_url || '',
        youtube_url: influencerData.youtube_url || '',
        twitter_url: influencerData.twitter_url || ''
      };

      console.log("Sending update data:", dataToSend);

      // Use the correct endpoint URL
      const response = await fetch(`http://127.0.0.1:8000/api/influencers/${id}/update/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setMessage("Influencer updated successfully!");
        
        // Call the refresh function passed from parent
        if (refreshInfluencers) {
          await refreshInfluencers();
        }

        // Wait a moment before redirecting
        setTimeout(() => {
          navigate("/influencers");
        }, 1500);
      } else {
        // Handle specific error messages from backend
        const errorMessage = typeof data === 'object' ? 
          (data.details || data.error || 'Failed to update influencer') : 
          'Failed to update influencer';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating influencer:", error);
      setError(error.message || "Failed to update influencer. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Edit Influencer</h2>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={influencerData.name} 
            onChange={handleInputChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Platform</Form.Label>
          <Form.Select 
            name="platform" 
            value={influencerData.platform} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Select Platform</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
            <option value="Twitter">Twitter</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Niche</Form.Label>
          <Form.Control 
            type="text" 
            name="niche" 
            value={influencerData.niche} 
            onChange={handleInputChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Followers Count</Form.Label>
          <Form.Control 
            type="number" 
            name="followers_count" 
            value={influencerData.followers_count} 
            onChange={handleInputChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Picture URL</Form.Label>
          <Form.Control 
            type="url" 
            name="profile_picture" 
            value={influencerData.profile_picture || ''} 
            onChange={handleInputChange} 
            placeholder="https://example.com/image.jpg"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Media Handle</Form.Label>
          <Form.Control 
            type="text" 
            name="social_media_handle" 
            value={influencerData.social_media_handle || ''} 
            onChange={handleInputChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Interests</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            name="interests" 
            value={influencerData.interests || ''} 
            onChange={handleInputChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Demographics</Form.Label>
          <Form.Control 
            type="text" 
            name="demography" 
            value={influencerData.demography || ''} 
            onChange={handleInputChange} 
          />
        </Form.Group>

        <h4 className="mt-4">Social Media Links</h4>
        
        <Form.Group className="mb-3">
          <Form.Label>Instagram URL</Form.Label>
          <Form.Control
            type="url"
            name="instagram_url"
            value={influencerData.instagram_url || ''}
            onChange={handleInputChange}
            placeholder="https://instagram.com/username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>TikTok URL</Form.Label>
          <Form.Control
            type="url"
            name="tiktok_url"
            value={influencerData.tiktok_url || ''}
            onChange={handleInputChange}
            placeholder="https://tiktok.com/@username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>YouTube URL</Form.Label>
          <Form.Control
            type="url"
            name="youtube_url"
            value={influencerData.youtube_url || ''}
            onChange={handleInputChange}
            placeholder="https://youtube.com/c/channelname"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Twitter URL</Form.Label>
          <Form.Control
            type="url"
            name="twitter_url"
            value={influencerData.twitter_url || ''}
            onChange={handleInputChange}
            placeholder="https://twitter.com/username"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Influencer
        </Button>
      </Form>
    </Container>
  );
};

export default AdminEditInfluencer;
