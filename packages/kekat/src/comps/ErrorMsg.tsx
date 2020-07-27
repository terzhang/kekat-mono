import React from 'react';

export const ErrorMsg = ({ error, from }: any) => {
  return (
    <div style={{ backgroundColor: 'red', color: 'white' }}>
      Error has occurred!
      <p>type: General</p>
      <p>origin: {from}</p>
      <p>message: {error}</p>
    </div>
  );
};
