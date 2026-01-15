import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: '10rem',
        height: '10rem',
        margin: 'auto',
        display: 'block',
      }}
    >
      <span className="visually-hidden">Loading ...</span>
    </Spinner>
  );
};

export default Loader;
