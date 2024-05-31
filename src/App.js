import React, { useState, useEffect } from 'react';
import './App.css';
import ComicList from './components/TABLE/ComicList';
import ComicListDesktop from './components/ComicListDesktop';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Isaac's Marvel Collection</h1>
      </header>
      <ComicListDesktop/>
    </div>
  );
}

export default App;
