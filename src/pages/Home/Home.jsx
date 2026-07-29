import React from 'react';
import CustomHelmet from '../../components/CustomHelmet/CustomHelmet';
import Hero from './Hero/Hero';
import RateStripe from './RateStripe/RateStripe';
import CentennialExcellence from './CentennialExcellence/CentennialExcellence';
import SeasonMasterpieces from './SeasonMasterpieces/SeasonMasterpieces';
import OwnPieceHistory from './OwnPieceHistory/OwnPieceHistory';
import './Home.css';

const Home = () => {
  return (
    <div className="font-body-base bg-background text-on-surface antialiased overflow-x-hidden">
      <CustomHelmet title="Home" />
      
      <Hero />
      <RateStripe />
      
      <main className="relative z-20 bg-background">
        <CentennialExcellence />
        <SeasonMasterpieces />
        <OwnPieceHistory />
      </main>
    </div>
  );
};

export default Home;
