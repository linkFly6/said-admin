import * as React from 'react';
import './App.styl';
import Hello from './components/Hello';

const logo = require('./logo.svg');

function App() {
  return (
    <div className="app">
      <div className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="app-intro">
        To get started, edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Hello name="TypeScript" />
    </div>
  );
}

export default App;
