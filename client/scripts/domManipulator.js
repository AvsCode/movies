import {
    highLightStarRatingClickHandler,
    highLightRatingOnHover,
    unHilightRating,
    submitRatedMovie
} from './ratings.js';
import carouselCreator from './carouselCreator.js';

const domManipulator = (function () {

    // let searchMoviesContainer;
    // let ratedMoviesContainer;
    // let recommendedMoviesContainer;
    let searchMoviesCarousel;
    let ratedMoviesCarousel;
    let recommendedMoviesCarousel;

    // Arrays of movie containers
    let searchMoviesContainersArray;
    let ratedMoviesContainersArray;
    let recommendedMoviesContainersArray;

    // movieSearchResults is an array of movie objects - NOT DOM elements
    function buildMovieResults(movieSearchResults) {
        movieSearchResults = movieSearchResults.filter((movie) => {
            if (!movie.poster_path) {
                return false;
            }
            return true;
        });
        document.getElementById('searchMoviesContainer').innerHTML = '';
        searchMoviesContainersArray = movieSearchResults.map((movie) => {
            return buildSingleMovieResult(movie);
        });
        searchMoviesCarousel = carouselCreator.createCarousel('searchMoviesContainer');
        searchMoviesCarousel.addItems(searchMoviesContainersArray);
    }

    function buildRecommendedMovies(recommendedMovies) {
        console.log(recommendedMovies);
        recommendedMoviesContainersArray = recommendedMovies.map((movie) => {
            console.log(movie);
            return buildSingleMovieResult(movie);
        });
        recommendedMoviesCarousel = carouselCreator.createCarousel('recommendedMoviesContainer');
        recommendedMoviesCarousel.addItems(recommendedMoviesContainersArray);
    }

    function buildRatedMovies(ratedMovies) {
        ratedMoviesContainersArray = ratedMovies.map((movie) => {
            return buildSingleMovieResult(movie);
        });
        ratedMoviesCarousel = carouselCreator.createCarousel('ratedMoviesContainer');
        ratedMoviesCarousel.addItems(ratedMoviesContainersArray);
    }

    function buildSingleMovieResult(movie) {
        let newDiv = buildSingleMovieContainer(movie);
        return newDiv;
    }

    function buildSingleMovieContainer(movie) {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("movieId", movie.id);
        newDiv.setAttribute("movieTitle", movie.title);
        newDiv.classList.add("singleMovie");
        newDiv = buildSingleMovieImage(newDiv, movie);
        newDiv = buildRating(newDiv, movie.movieRating);
        return newDiv;
    }

    function buildSingleMovieImage(newDiv, movie) {
        const posterPath = 'https://image.tmdb.org/t/p/w500/';
        let moviePosterUrl = movie.poster_path != null ? posterPath + movie.poster_path : './images/placeholder.png';

        let newMoviePoster = document.createElement("img");
        newMoviePoster.src = moviePosterUrl;
        newMoviePoster.classList.add("singleMovieImage");
        newDiv.appendChild(newMoviePoster);
        return newDiv;
    }

    function buildRating(newDiv, movieRating) {
        let rating = document.createElement("div");
        rating.classList.add("rating");

        for (let i = 1; i <= 5; i++) {
            let ratingSpan = document.createElement("span");
            ratingSpan.setAttribute('rating', i);
            ratingSpan.innerHTML = "★";

            if (i <= movieRating) {
                ratingSpan.classList.add("rated");
            }

            ratingSpan.addEventListener("click", highLightStarRatingClickHandler);
            ratingSpan.addEventListener("click", submitRatedMovie);
            ratingSpan.addEventListener("mouseover", highLightRatingOnHover);
            ratingSpan.addEventListener("mouseleave", unHilightRating);
            rating.appendChild(ratingSpan);
        }
        newDiv.appendChild(rating);
        return newDiv;
    }

    return {
        buildMovieResults,
        buildRatedMovies,
        buildRecommendedMovies,
    }
})();

export default domManipulator;