import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "../axios";
import "./Row.scss";
import mylist from "../video.json"
import { useWindowSize } from "./useWindowSize";

const base_url = "https://image.tmdb.org/t/p/original";

type Props = {
    title: string;
    isLargeRow?: boolean;
    genre?: string;
    media?: string;
};

type Movie = {
    id: string;
    name: string;
    media: string;
    title: string | null;
    original_name: string;
    poster_path: string;
    backdrop_path: string;
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

export const Row = ({ title, isLargeRow, genre}: Props) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [trailerUrl, setTrailerUrl] = useState<string | null>("");
    const [trailerTitle, setTrailerTitle] = useState<string | null>("");
    const [overview, setOverview] = useState<string | null>("");
    const [stars, setStars] = useState<number | null>();
    const [impression, setImpression] = useState<string | null>();
    const [width, height] = useWindowSize();

    useEffect(() => {
        async function fetchData() {
            const movieList: Movie[] = [];
            const movies = mylist.videos;

            for (let movie of movies) {
                if (genre !== movie.genre) { continue; }
                const request = await axios.get(`/${movie.media}/${movie.id}?api_key=${process.env.REACT_APP_API_KEY}&language=${movie.genre === "marvel" ? "en" : "ja"}`);
                const data = await request.data;
                data.stars = movie.stars;
                data.impression = movie.impression;
                data.media = movie.media;
                movieList.push(data);
            }
            setMovies(movieList);
            return movieList;
        }
        fetchData();
    }, [genre]);


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


    const handleClick = async (movie: Movie) => {
        let urlRequest = await axios.get(`/${movie.media}/${movie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ja`);
        const url = urlRequest.data.results[0]?.key;

        let requestJapanese = await axios.get(`/${movie.media}/${movie.id}?api_key=${process.env.REACT_APP_API_KEY}&language=ja`);
        setOverview(requestJapanese.data.overview);

        if (urlRequest) {
            if (trailerUrl !== url) {
                setTrailerUrl(url);
                setTrailerTitle(movie?.title || movie?.name);
                setStars(movie.stars);
                setImpression(movie.impression);
            }
        } else {
            setTrailerUrl("");
        }

    };

    const closeModal = () => {
        setOverview("");
    }

    return (
        <div>
            <div className="Row">
                <h2>{title}</h2>
                <div className="Row-posters">
                    {movies.map((movie, i) => (
                        <img
                            key={movie.id}
                            className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
                            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path
                                }`}
                            alt={movie?.title || movie?.name}
                            onClick={() => handleClick(movie)}
                        />
                    ))}
                </div>
            </div>

            <div className="Modal">
                {overview &&
                    <div id="overlay" onClick={closeModal}>
                        <div className="flexbox">
                            <h2>{trailerTitle}</h2>
                            <p>おすすめ度：<span className="star5_rating" data-rate={stars}></span></p>
                            <p className="impression">{impression}</p>
                            {trailerUrl &&
                                <YouTube videoId={trailerUrl} opts={(width <= 640) ? opts1 : opts2} />
                            }

                            <div id="center">
                                <p>{overview}</p>
                            </div>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};