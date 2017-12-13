import {
    highLightStarRatingClickHandler,
    highLightRatingOnHover,
    unHilightRating,
    submitRatedMovie
} from './ratings.js';


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
        for(let i = numberOfDisplayedMovies; i < searchMovies.length; i++){
            searchMovies[i].classList.add("hidden", ["toRight"]);
        }
    }
    function formatMovieLists() {
        setMovieContainers();
        setNumberOfDisplayedMovies();

        for (let i = firstDisplayedSearchMovieIndex; i < firstDisplayedSearchMovieIndex + numberOfDisplayedMovies; i++) {
            if (searchMovies[i] && searchMovies[i].classList.contains("hidden")) {
                searchMovies[i].classList.remove("hidden");
            }
        }
        for(let i = firstDisplayedRatedMovieIndex; i < firstDisplayedRatedMovieIndex + numberOfDisplayedMovies; i++){
            if (ratedMovies[i] && ratedMovies[i].classList.contains("hidden")) {
                ratedMovies[i].classList.remove("hidden");
            }
        }
        for(let i = firstDisplayedRecommendedMovieIndex; i < firstDisplayedRecommendedMovieIndex + numberOfDisplayedMovies; i++){
            if (recommendedMovies[i] && recommendedMovies[i].classList.contains("hidden")) {
                recommendedMovies[i].classList.remove("hidden");
            }
        }
        for (let i = firstDisplayedSearchMovieIndex + numberOfDisplayedMovies; i < searchMovies.length; i++) {
            searchMovies[i].classList.add("hidden");
        }
        for (let i = firstDisplayedRatedMovieIndex + numberOfDisplayedMovies; i < ratedMovies.length; i++) {
            ratedMovies[i].classList.add("hidden");
        }
        for (let i = firstDisplayedRecommendedMovieIndex + numberOfDisplayedMovies; i < recommendedMovies.length; i++) {
            recommendedMovies[i].classList.add("hidden");
        }
    }

    function shiftSearchMovieList(direction){
        let location = firstDisplayedSearchMovieIndex;
        if(direction === 'left'){
            // Loop through currently visible items, set them to hidden
            for(let i = 0; i < numberOfDisplayedMovies; i++){
                if(location == searchMovies.length){
                    location = 0;
                }
                searchMovies[location].classList.remove("toRight");
                searchMovies[location].classList.remove("fromLeft");
                searchMovies[location].classList.remove("fromRight");
                searchMovies[location].classList.add("hidden");
                searchMovies[location].classList.add("toLeft");
                location ++;
            }
            if(firstDisplayedSearchMovieIndex == 0){
                location = searchMovies.length - 1;
            }
            else{
                location = firstDisplayedSearchMovieIndex - 1;
            }
            // Loop again to set newly visible items
            for(let i = 0; i < numberOfDisplayedMovies; i++){
                if(location == -1){
                    location = searchMovies.length - 1;
                }
                searchMovies[location].classList.remove("hidden");
                searchMovies[location].classList.remove("toRight");
                searchMovies[location].classList.remove("toLeft");
                searchMovies[location].classList.remove("fromleft");
                searchMovies[location].classList.add("fromRight");
                location--;
            }
            firstDisplayedSearchMovieIndex = location + 1;
        }
        else{
            // Loop through currently visible items, set them to hidden
            for(let i = 0; i < numberOfDisplayedMovies; i++){
                if(location == searchMovies.length){
                    location = 0;
                }
                searchMovies[location].classList.remove("toLeft");
                searchMovies[location].classList.remove("fromRight");
                searchMovies[location].classList.remove("fromLeft");
                searchMovies[location].classList.add("hidden");
                searchMovies[location].classList.add("toRight");
                location++;
            }
            firstDisplayedSearchMovieIndex = location;
            // Loop again to set newly visible items
            for(let i = 0; i < numberOfDisplayedMovies; i++){
                if(location == searchMovies.length){
                    location = 0;
                }
                searchMovies[location].classList.remove("hidden");
                searchMovies[location].classList.remove("toRight");
                searchMovies[location].classList.remove("toLeft");
                searchMovies[location].classList.remove("fromRight");
                searchMovies[location].classList.add("fromLeft");
                location++;
            }
        }
    }

    function setVisibileMovieIndexes() {
        for (let i = 0; i < searchMovies.length; i++) {
            if (searchMovies[i] && !searchMovies[i].classList.contains("hidden")) {
                firstDisplayedSearchMovieIndex = i;
            }
        }
        for (let i = 0; i < ratedMovies.length; i++) {
            if (ratedMovies[i] && !ratedMovies[i].classList.contains("hidden")) {
                firstDisplayedRatedMovieIndex = i;
            }
        }
        for (let i = 0; i < recommendedMovies.length; i++) {
            if (recommendedMovies[i] && !recommendedMovies[i].classList.contains("hidden")) {
                firstDisplayedRecommendedMovieIndex = i;
            }
        }
        firstDisplayedSearchMovieIndex = firstDisplayedSearchMovieIndex ? firstDisplayedSearchMovieIndex : 0;
        firstDisplayedRatedMovieIndex = firstDisplayedRatedMovieIndex ? firstDisplayedRatedMovieIndex : 0;
        firstDisplayedRecommendedMovieIndex = firstDisplayedRecommendedMovieIndex ? firstDisplayedRecommendedMovieIndex : 0;
    }

    function setNumberOfDisplayedMovies() {
        availableWidth = window.innerWidth;
        numberOfDisplayedMovies = Math.floor(availableWidth / 200) - 1;
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
        formatMovieLists();
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
        formatMovieLists();
    }

    return {
        buildMovieResults,
        formatMovieLists,
        buildRatedMovies,
        buildSingleMovieResult,
        buildSingleMovieContainer,
        buildSingleMovieImage,
        buildRating,
        buildRecommendedMovies,
        shiftSearchMovieList
    }
})();

export default domManipulator;