import React from 'react';
import './App.css';
// import { Row } from "./components/Row";
import { CardsCarousel } from "./components/CardsCarousel";
import { Banner } from "./components/Banner";
import { Nav } from "./components/Nav";

function App() {
  return (
    <div className="App">
      <Nav />
      <Banner />
      <CardsCarousel title="MARVEL Cinematic Universe" isLargeRow genre="marvel" />
      <CardsCarousel title='Movies' genre="movies" />
      <CardsCarousel title="Anime (Autumn 2022)" isLargeRow genre="anime_2022_autumn" />
      <CardsCarousel title="Anime (Summer 2022)" isLargeRow genre="anime_2022_summer" />
      {/* <CardsCarousel title="Anime (All Time)" genre="anime_all" /> */}
    </div>
  );
}

export default App;