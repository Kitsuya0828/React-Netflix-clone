import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import axios from "../axios";
// import "./CardsCarousel.scss";
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
    overview: string | null;
    backdrop_path: string;
    stars: number | null;
    impression: string | null;
};


// const useStyles = createStyles((theme) => ({
//     card: {
//       height: '20vh',
//       width: 'auto',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     },
  
//     title: {
//       fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//       fontWeight: 900,
//       color: theme.black,
//       lineHeight: 1.2,
//       fontSize: 32,
//       marginTop: theme.spacing.xs,
//     },
  
//     category: {
//       color: theme.white,
//       opacity: 0.7,
//       fontWeight: 700,
//       textTransform: 'uppercase',
//     },
// }));


function Card(movie: Movie) {
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
            <Image
                radius="lg"
                src={`${base_url}${movie.poster_path}`}
                onClick={() => handleClick(movie)}
            />
        </div>
    );
}


export const CardsCarousel = ({ title, isLargeRow, genre }: Props) => {
    const [movies, setMovies] = useState<Movie[]>([]);
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

    return (
        <div>
            <Box
                sx={(theme) => ({
                    padding: theme.spacing.lg
                })}
            >
                <Title color="white" size="h2">{title}</Title>
                <Carousel
                    height="auto"
                    slideSize= {mobile ? "33.333%" : "20%"}
                    slideGap="xl"
                    dragFree
                    align="start"
                    slidesToScroll={3}
                    styles={{
                        control: {
                          '&[data-inactive]': {
                            opacity: 0,
                            cursor: 'default',
                          },
                        },
                    }}
                >
                    {
                        movies.map((movie) => (
                            <Carousel.Slide key={movie.title}>
                                <Card {...movie} />
                            </Carousel.Slide>
                        ))
                    }
                </Carousel>
            </Box>

        </div>
    );
};