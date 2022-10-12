import React, { useState, useEffect } from "react";
import axios from "../axios";
import Rating from "@mui/material/Rating";
import "./Banner.scss";
import "./CardsCarousel.scss";
import mylist from "../video.json"
import { Modal, createStyles, Paper, Text, Image, Box, Title, Button, useMantineTheme } from '@mantine/core';

const base_url = "https://image.tmdb.org/t/p/original";

type Movie = {
  id: string;
  name: string;
  title: string;
  media: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string | null;
  stars: number | null;
  impression: string | null;
};


export const Banner = () => {
  const [movie, setMovie] = useState<Movie>();
  const [opened, setOpened] = useState(false);
  const [url, setUrl] = useState("");

  const handleClick = async (movie_: Movie) => {
      let urlRequest = await axios.get(`/${movie_.media}/${movie_.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ja`);
      console.log(urlRequest.data);
      setUrl(urlRequest.data.results[0]?.key);
      console.log(url);
      setOpened(true);
  };

  useEffect(() => {
    async function fetchData() {
      const movie = mylist.videos[0];
      const request = await axios.get(`/${movie.media}/${movie.id}?api_key=${process.env.REACT_APP_API_KEY}`);
      const data = await request.data;
      data.stars = movie.stars;
      data.impression = movie.impression;
      data.media = movie.media;
      setMovie(data);
      return request;
    }
    fetchData();
  }, []);

  function truncate(str: any, n: number) {
    if (str !== undefined) {
      return str.length > n ? str?.substr(0, n - 1) + "..." : str;
    }
  }

  return (
    <div>
      <header
        className="Banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url("${base_url}${movie?.backdrop_path}")`,
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

      {movie && 
        <div>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <Title order={3}>{movie.name || movie.title}</Title>
                
                <Box style={{display: "flex", paddingBottom: "10px"}}>
                    <Text size="xs" color="gray">おすすめ度：</Text>
                    {movie.stars &&
                        <Rating name="half-rating-read" defaultValue={movie.stars} precision={0.5} size="small" readOnly />
                    }
                    <Text size="xs" color="gray">{movie.stars}</Text>
                </Box>

                <iframe src={`https://www.youtube.com/embed/${url}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                
                <Box style={{paddingTop: "10px"}}>
                    <Text size="md">{movie.overview}</Text>
                </Box>
            </Modal>
        </div>
      }

    </div>
  );
};