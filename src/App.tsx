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
      <Row title="MARVEL Cinematic Universe" isLargeRow genre="marvel" media='movie' />
      <Row title='Movies' genre="movies" media='movie' />
      <Row title="Anime (Summer 2022)" isLargeRow genre="anime" media='tv' />
      <Row title="Anime (All Time)" genre="anime_all" media='tv' />
    </div>
  );
}

export default App;