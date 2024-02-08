import React from 'react';
import Header from '../components/Header'; // Import the Header component
import Body from '../components/Body'; // Import the Body component

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Render the Header component */}
      <Header /> 
      <Body />
    </div>
  );
};

export default HomePage;
