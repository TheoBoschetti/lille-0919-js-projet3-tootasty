import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import CampaignCard from "../components/CampaignCard";
import axios from "axios";
import "./styles/Home.scss";
import LearnMore from "../components/LearnMore";
const { apiCall } = require("../conf");

function Home() {
  const [campaignInfo, setCampaignInfo] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiCall}/campaign?finishing=true&limit=6`)
      .then(res => setCampaignInfo(res.data));
  }, []);

  return (
    <section className="Home">
      <Hero />
      <div className="cardContainer">
        {campaignInfo.map((campaign, key) => {
          return <CampaignCard key={key} campaignInfo={campaign} />;
        })}
      </div>
      <LearnMore />
    </section>
  );
}

export default Home;
