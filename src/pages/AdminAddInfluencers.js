import React, { useState, useRef } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

const AdminAddInfluencer = () => {
  const [influencerData, setInfluencerData] = useState({
    name: "",
    platform: "",
    niche: "",
    followers_count: "",
    profile_picture: "",  // Changed to string for URL
    social_handle: "",
    interests: "",
    demography: "",  // Add demography field
    instagram_url: "",
    tiktok_url: "",
    youtube_url: "",
    twitter_url: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setInfluencerData({ ...influencerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const dataToSend = {
        ...influencerData,
        followers_count: parseInt(influencerData.followers_count),
        // Fix the field name to match backend
        social_media_handle: influencerData.social_handle,
        // Ensure URLs are properly formatted or null
        profile_picture: influencerData.profile_picture || null,
        instagram_url: influencerData.instagram_url || null,
        tiktok_url: influencerData.tiktok_url || null,
        youtube_url: influencerData.youtube_url || null,
        twitter_url: influencerData.twitter_url || null,
        demography: influencerData.demography || null  // Include demography
      };

      // Remove the social_handle field as we're using social_media_handle
      delete dataToSend.social_handle;

      console.log("Sending data:", dataToSend);

      const response = await fetch("http://127.0.0.1:8000/api/influencers/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ API Error Response:", data);
        throw new Error(JSON.stringify(data));
      }

      console.log("✅ Influencer Added:", data);
      setMessage("Influencer added successfully!");
      
      // Reset form fields
      setInfluencerData({
        name: "",
        platform: "",
        niche: "",
        followers_count: "",
        profile_picture: "",
        social_handle: "",
        interests: "",
        demography: "",
        instagram_url: "",
        tiktok_url: "",
        youtube_url: "",
        twitter_url: ""
      });
    } catch (error) {
      console.error("❌ Error adding influencer:", error);
      try {
        const errorData = JSON.parse(error.message);
        const errorMessages = Object.entries(errorData)
          .map(([field, errors]) => {
            const errorMessage = Array.isArray(errors) ? errors.join(', ') : errors;
            return `${field}: ${errorMessage}`;
          })
          .join('\n');
        setError(errorMessages || "Error adding influencer. Please check all fields.");
      } catch (parseError) {
        setError("Error adding influencer. Please check all fields.");
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Influencer</h2>
      
      {message && <Alert variant="success" dismissible onClose={() => setMessage("")}>{message}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

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
            value={influencerData.profile_picture}
            onChange={handleInputChange}
            placeholder="https://example.com/profile.jpg"
          />
          <Form.Text className="text-muted">
            Enter a valid URL for the profile picture
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Handle</Form.Label>
          <Form.Control
            type="text"
            name="social_handle"
            value={influencerData.social_handle}
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
            value={influencerData.interests}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Demographics</Form.Label>
          <Form.Select
            name="demography"
            value={influencerData.demography}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Demographics</option>
            <option value="13-17">13-17</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45+">45+</option>
          </Form.Select>
          <Form.Text className="text-muted">
            Select the primary age group of the influencer's audience
          </Form.Text>
        </Form.Group>

        <h4 className="mt-4">Social Media Links</h4>
        
        <Form.Group className="mb-3">
          <Form.Label>Instagram URL</Form.Label>
          <Form.Control
            type="url"
            name="instagram_url"
            value={influencerData.instagram_url}
            onChange={handleInputChange}
            placeholder="https://instagram.com/username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>TikTok URL</Form.Label>
          <Form.Control
            type="url"
            name="tiktok_url"
            value={influencerData.tiktok_url}
            onChange={handleInputChange}
            placeholder="https://tiktok.com/@username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>YouTube URL</Form.Label>
          <Form.Control
            type="url"
            name="youtube_url"
            value={influencerData.youtube_url}
            onChange={handleInputChange}
            placeholder="https://youtube.com/c/channelname"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Twitter URL</Form.Label>
          <Form.Control
            type="url"
            name="twitter_url"
            value={influencerData.twitter_url}
            onChange={handleInputChange}
            placeholder="https://twitter.com/username"
          />
        </Form.Group>

        <Button variant="primary" type="submit">Add Influencer</Button>
      </Form>
    </Container>
  );
};

export default AdminAddInfluencer;
