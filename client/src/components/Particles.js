import React from 'react';

function Particles() {
  return (
    <>
      <div className="orb orb-1 animate-drift"></div>
      <div className="orb orb-2 animate-drift"></div>
      <div className="orb orb-3 animate-drift"></div>
      <div className="particles-container">
        {[...Array(10)].map((_, i) => (
          <div className="particle" key={i} />
        ))}
      </div>
    </>
  );
}

export default Particles;
