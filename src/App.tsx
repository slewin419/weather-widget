import React from 'react';
import './App.css';
import Weather from './components/Weather';

// TODO: Add F/C toggle

function App() {
  return (
      <div>
          <Weather zipCode={"3280"}/>
      </div>
  );
}

export default App;
