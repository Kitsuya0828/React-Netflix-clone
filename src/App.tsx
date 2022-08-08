import React from 'react';
import './App.css';
import { Row } from "./components/Row";
import { Banner } from "./components/Banner";
import { Nav } from "./components/Nav";

function App() {
  return (
    <div className="App">
      <Nav />
      <Banner />
      <Row title="MARVEL Cinematic Universe" isLargeRow />
      <Row title='Movies'/>
      <Row title="Anime (Summer 2022)" isLargeRow />
      <Row title="Anime (All Time)" />
    </div>
  );
}

export default App;