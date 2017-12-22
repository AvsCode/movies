import {
    highLightStarRatingClickHandler,
    highLightRatingOnHover,
    unHilightRating,
    submitRatedMovie
} from './ratings.js';
import carouselCreator from './carouselCreator.js';

const domManipulator = (function() {

    let searchMoviesContainer;
    let ratedMoviesContainer;
    let recommendedMoviesContainer;
    let searchMovies;
    let ratedMovies;
    let recommendedMovies;
    
    let firstDisplayedSearchMovieIndex = 0;
    let firstDisplayedRatedMovieIndex = 0;
    let firstDisplayedRecommendedMovieIndex = 0;
    
    let availableWidth;
    let numberOfDisplayedMovies;
    let searchMovieProperties = {};
    
    setMovieContainers();

    function buildMovieResults(movieSearchResults, movieListContainer) {
        while (movieListContainer.firstChild) {
            movieListContainer.removeChild(movieListContainer.firstChild);
        }
        movieSearchResults = movieSearchResults.filter((movie) => {
            if (!movie.poster_path) {
                return false;
            }
            buildSingleMovieResult(movie, movieListContainer);
            return true;
        });
        setMovieContainers();
        setNumberOfDisplayedMovies();
    }

    function setNumberOfDisplayedMovies() {
        searchMovieProperties.totalWidth = searchMoviesContainer.scrollWidth;
        availableWidth = window.innerWidth;
        searchMovieProperties.itemWidth = 220;
        searchMovieProperties.shiftWidth = Math.floor(availableWidth / searchMovieProperties.itemWidth) * searchMovieProperties.itemWidth;
        searchMovieProperties.shiftNum = Math.ceil(searchMovieProperties.totalWidth / searchMovieProperties.shiftWidth) -1;
        searchMovieProperties.shiftLocation = 0;
        numberOfDisplayedMovies = Math.floor(availableWidth / 200) - 1;

        console.log("Total width: " + searchMovieProperties.totalWidth);
        console.log("Available width: " + availableWidth);
        console.log("ItemWidth: " + searchMovieProperties.itemWidth);
        console.log("Shift Width: " + searchMovieProperties.shiftWidth);
        console.log("Number of Shifts: " + searchMovieProperties.shiftNum);
    }

    function shiftMovieSearch(direction){
        if(direction === "right"){
            searchMovieProperties.shiftLocation ++;
        }
        else{
            searchMovieProperties.shiftLocation --;
        }
        searchMoviesContainer.setAttribute("style", `transform: translateX(${searchMovieProperties.shiftWidth * searchMovieProperties.shiftLocation * (-1)}px)`);
    }
    function setMovieContainers() {
        searchMoviesContainer = document.getElementById("displayedMovies");
        ratedMoviesContainer = document.getElementById("ratedMoviesContainer");
        recommendedMoviesContainer = document.getElementById("recommendedMoviesContainer");
        searchMovies = searchMoviesContainer.children;
        ratedMovies = ratedMoviesContainer.children;
        recommendedMovies = recommendedMoviesContainer.children;
    }
    function buildRatedMovies(ratedMovies) {
        while (ratedMoviesContainer.firstChild) {
            ratedMoviesContainer.removeChild(ratedMoviesContainer.firstChild);
        }
        ratedMovies.map((movie) => buildSingleMovieResult(movie, ratedMoviesContainer));
    }

    function buildSingleMovieResult(movie, container) {
        let newDiv = buildSingleMovieContainer(movie);
        buildSingleMovieImage(movie, newDiv);
        buildRating(newDiv, movie.movieRating, );
        container.appendChild(newDiv);
    }

    function buildSingleMovieContainer(movie) {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("movieId", movie.id);
        newDiv.setAttribute("movieTitle", movie.title);
        newDiv.classList.add("singleMovie");
        return newDiv;
    }

    function buildSingleMovieImage(movie, newDiv) {
        const posterPath = 'https://image.tmdb.org/t/p/w500/';
        let moviePosterUrl = movie.poster_path != null ? posterPath + movie.poster_path : './images/placeholder.png';

        let newMoviePoster = document.createElement("img");
        newMoviePoster.src = moviePosterUrl;
        newMoviePoster.classList.add("singleMovieImage");
        newDiv.appendChild(newMoviePoster);
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
    }

    function buildRecommendedMovies(recommendedMovies) {
        let recommendedMovieKeys = Object.keys(recommendedMovies);
        while (recommendedMoviesContainer.firstChild) {
            ratedMoviesContainer.removeChild(recommendedMoviesContainer.firstChild);
        }
        recommendedMovieKeys.map((movieId) => buildSingleMovieResult(recommendedMovies[movieId], recommendedMoviesContainer));
    }

    return {
        buildMovieResults,
        buildRatedMovies,
        buildSingleMovieResult,
        buildSingleMovieContainer,
        buildSingleMovieImage,
        buildRating,
        buildRecommendedMovies,
        shiftMovieSearch,
        setNumberOfDisplayedMovies
    }
})();

export default domManipulator;