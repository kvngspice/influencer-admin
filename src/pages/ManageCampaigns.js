import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/admin/campaigns/", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/campaigns/${campaignId}/delete/`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error('Failed to delete campaign');
      fetchCampaigns(); // Refresh the list
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2>Manage Campaigns</h2>
      {campaigns.length === 0 ? (
        <Alert variant="info">No campaigns found in the database.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Budget</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.id}</td>
                <td>{campaign.name}</td>
                <td>${campaign.budget}</td>
                <td>{campaign.platforms.join(", ")}</td>
                <td>{campaign.active ? "Active" : "Inactive"}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManageCampaigns;
