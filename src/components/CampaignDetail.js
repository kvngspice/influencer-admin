import React from "react";
import { useParams } from "react-router-dom";

const CampaignDetail = () => {
  const { id } = useParams();
  return <h1>Campaign Detail Page - ID: {id}</h1>;
};

export default CampaignDetail;
