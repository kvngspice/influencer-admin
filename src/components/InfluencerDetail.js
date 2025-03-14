import React from "react";
import { useParams } from "react-router-dom";

const InfluencerDetail = () => {
  const { id } = useParams();
  return <h1>Influencer Detail Page - ID: {id}</h1>;
};

export default InfluencerDetail;
