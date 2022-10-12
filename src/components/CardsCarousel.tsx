import { useEffect, useState } from "react";
// import YouTube from "react-youtube";
import axios from "../axios";
import "./CardsCarousel.scss";
import mylist from "../video.json"
// import { useWindowSize } from "./useWindowSize";
// import Box from '@mui/material/Box';
// import Modal from "@mui/material/Modal";
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Modal, createStyles, Paper, Text, Image, Box, Title, Button, useMantineTheme } from '@mantine/core';

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


const useStyles = createStyles((theme) => ({
    card: {
      height: '20vh',
      width: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  
    title: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      fontWeight: 900,
      color: theme.white,
      lineHeight: 1.2,
      fontSize: 32,
      marginTop: theme.spacing.xs,
    },
  
    category: {
      color: theme.white,
      opacity: 0.7,
      fontWeight: 700,
      textTransform: 'uppercase',
    },
}));


function Card(movie: Movie) {
    // const { classes } = useStyles();
    const [opened, setOpened] = useState(false);
    const [url, setUrl] = useState("");

    const handleClick = async (movie: Movie) => {
        let urlRequest = await axios.get(`/${movie.media}/${movie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ja`);
        setUrl(urlRequest.data.results[0]?.key);
        setOpened(true)
    };

    return (
        <div>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={movie.name || movie.title}
            >
                <iframe src={`https://www.youtube.com/embed/${url}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </Modal>
            <Image
                radius="lg"
                src={`${base_url}${movie.poster_path}`}
                onClick={() => handleClick(movie)}
            />
        </div>
    );
}


export const Row = ({ title, isLargeRow, genre }: Props) => {
    // const [open, setOpen] = useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    // const [trailerUrl, setTrailerUrl] = useState<string | null>("");
    // const [trailerTitle, setTrailerTitle] = useState<string | null>("");
    // const [overview, setOverview] = useState<string | null>("");
    // const [stars, setStars] = useState<number | null>();
    // const [impression, setImpression] = useState<string | null>();
    // const [width, height] = useWindowSize();

    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

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


    // const handleClick = async (movie: Movie) => {
    //     let urlRequest = await axios.get(`/${movie.media}/${movie.id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ja`);
    //     const url = urlRequest.data.results[0]?.key;

    //     let requestJapanese = await axios.get(`/${movie.media}/${movie.id}?api_key=${process.env.REACT_APP_API_KEY}&language=ja`);
    //     setOverview(requestJapanese.data.overview);

    //     if (urlRequest) {
    //         if (trailerUrl !== url) {
    //             setTrailerUrl(url);
    //             setTrailerTitle(movie?.title || movie?.name);
    //             setStars(movie.stars);
    //             setImpression(movie.impression);
    //         }
    //     } else {
    //         setTrailerUrl("");
    //     }
    //     setOpen(true);
    // };

    // const closeModal = () => {
    //     setOverview("");
    // }

    // const modalBody = (
    //     <div>
    //         {overview &&
    //             <div id="overlay">
    //                 <div className="flexbox">
    //                     <Box>
    //                         <h1>{trailerTitle}</h1>
    //                         <p className="star">おすすめ度：<span className="star5_rating" data-rate={stars}></span></p>
    //                         <p className="impression">{impression}</p>
    //                     </Box>

                        

    //                     {trailerUrl &&
    //                         <YouTube videoId={trailerUrl} opts={(width <= 640) ? opts1 : opts2} />
    //                         // <YouTube videoId={trailerUrl} opts={opts2} />
    //                     }

    //                     <div id="center">
    //                         <p>{overview}</p>
    //                     </div>
    //                     {/* <button onClick={closeModal}>Close</button> */}
    //                 </div>
    //             </div>
    //         }
    //     </div>

    // )

    return (
        <div>
            <Box
                sx={(theme) => ({
                    padding: theme.spacing.lg
                })}
            >
                <Title color="white" size="h2">{title}</Title>
            </Box>

            <Carousel
                height="auto"
                slideSize= {mobile ? "33.333%" : "20%"}
                slideGap="md"
                dragFree
                align="start"
                slidesToScroll={3}
            >
                {
                    movies.map((movie) => (
                        <Carousel.Slide key={movie.title}>
                            <Card {...movie} />
                        </Carousel.Slide>
                    ))
                }
            </Carousel>
        </div>
    );
};