// Footer component
import React from 'react';
import layers from '../../../assets/images/Layers.png';

const Footer = ({ showFooter = false }) => {
  const layerStyle = showFooter ? { position: 'fixed', bottom: 0 } : {};

  return (
    <div className="layer" style={layerStyle}>
      <img src={layers} alt="" />
    </div>
  );
};

export default Footer;
