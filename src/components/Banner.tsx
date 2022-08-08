import React, { useState, useEffect } from "react";
import axios from "../axios";
import "./Banner.scss";
import mylist from "../video.json"

type movieProps = {
  title?: string;
  name?: string;
  orignal_name?: string;
  backdrop_path?: string;
  overview?: string;
};

export const Banner = () => {
  const [movie, setMovie] = useState<movieProps>({});
  useEffect(() => {
    async function fetchData() {
      const movie = mylist.banner;
      const request = await axios.get(`/movie/${movie.id}?api_key=4e8834d2b0c32a4fc626c0a80ad37214`);
      setMovie(request.data);
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

  return (
    <header
      className="Banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="Banner-contents">
        <h1 className="banner-title">
          {movie?.title || movie?.name || movie?.orignal_name}
        </h1>
        <div className="Banner-buttons">
          <button className="Banner-button">Trailer</button>
        </div>

        <h1 className="Banner-description">{truncate(movie?.overview, 200)}</h1>
      </div>

      <div className="Banner-fadeBottom" />
    </header>
  );
};