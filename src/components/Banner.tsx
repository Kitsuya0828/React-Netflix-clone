import React, { useState, useEffect } from "react";
import axios from "../axios";
import YouTube from "react-youtube";
import "./Banner.scss";
import "./Row.scss";
import mylist from "../video.json"
import { useWindowSize } from "./useWindowSize";

type Movie = {
  id: string;
  name: string;
  title: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string | null;
  stars: number | null;
  impression: string | null;
};

// trailerのoption
type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};


export const Banner = () => {
  const [movie, setMovie] = useState<Movie>();
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");
  const [trailerTitle, setTrailerTitle] = useState<string | null>("");
  const [overview, setOverview] = useState<string | null>("");
  const [stars, setStars] = useState<number | null>();
  const [impression, setImpression] = useState<string | null>();
  const [width, height] = useWindowSize();

  useEffect(() => {
    async function fetchData() {
      const movie = mylist.videos[0];
      const request = await axios.get(`/movie/${movie.id}?api_key=${process.env.REACT_APP_API_KEY}`);
      const data = await request.data;
      data.stars = movie.stars;
      data.impression = movie.impression;
      setMovie(data);
      return request;
    }
    fetchData();
  }, []);
  console.log(movie);

  function truncate(str: any, n: number) {
    if (str !== undefined) {
      return str.length > n ? str?.substr(0, n - 1) + "..." : str;
    }
  }

  const handleClick = async (movie: Movie) => {
    let urlRequest = await axios.get(`/movie/${movie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}`);
    const url = urlRequest.data.results[0]?.key;

    if (urlRequest) {
        if (trailerUrl !== url) {
            setTrailerUrl(url);
            setTrailerTitle(movie.title);
            setStars(movie.stars);
            setImpression(movie.impression);
            setOverview(movie.overview);
        } 
    } else {
        setTrailerUrl("");
    }
    
};
const closeModal = () => {
  setTrailerUrl("");
}

const opts1: Options = {    
  height: "180",
  width: "320",
  playerVars: {
      autoplay: 1,
  },
};

const opts2: Options = {    
  height: "360",
  width: "640",
  playerVars: {
      autoplay: 1,
  },
};

  return (
    <div>
    <header
      className="Banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >

        {movie &&
              <div className="Banner-contents">
                <h1 className="banner-title">
                {movie.title || movie.name || movie.original_name}
              </h1>
              <div className="Banner-buttons">
                <button className="Banner-button" onClick={() => handleClick(movie)}>Trailer</button>
              </div>
      
              <h1 className="Banner-description">{truncate(movie.overview, 200)}</h1>
              </div>
        }


      <div className="Banner-fadeBottom" />
    </header>
          <div className="Modal">         
          {trailerUrl && 
              <div id="overlay" onClick={closeModal}>
                  <div className="flexbox">
                      <h2>{trailerTitle}</h2>
                      <p>おすすめ度：<span className="star5_rating" data-rate={stars}></span></p>
                      <p className="impression">{impression}</p>
                      <YouTube videoId={trailerUrl} opts={
                          (width <= 640)? opts1 : opts2
                          } />
                      <div id="center">
                          <p>{movie? movie.overview : null}</p>
                      </div>
                      <button onClick={closeModal}>Close</button>
                  </div>
              </div>
          }
      </div>
      </div>
  );
};