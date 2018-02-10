import {
    highLightStarRatingClickHandler,
    highLightRatingOnHover,
    unHilightRating,
    submitRatedMovie
} from './ratings.js';
import carouselCreator from './carouselCreator.js';
import cognitoApi from './cognitoApi';

const domManipulator = (function () {
    const posterPath = 'https://image.tmdb.org/t/p/w500/';

    let loginError = document.getElementById("loginError");
    let loginForm = document.getElementById("loginForm");
    let loggedInUser = document.getElementById("loggedInUser");
    let signOutBtn = document.getElementById("signOut");
    let popularMoviesHtml = document.getElementById("popularMoviesContainer");

    let searchMoviesCarousel;
    let ratedMoviesCarousel;
    let recommendedMoviesCarousel;

    let loggedInUserName;

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
    function buildPopularMovies(popularMovies){
        let tempMovies = [];
        // Building individual Popular Movie divs
        for(let i = 0; i < popularMovies.length; i++){
            let posterUrl = posterPath + popularMovies[i].backdrop_path;
            let posterImg = document.createElement('img');
            posterImg.setAttribute("alt", popularMovies[i].title);
            posterImg.setAttribute("title", popularMovies[i].title)
            posterImg.src = posterUrl;

            let movieTitle = document.createElement("h3");
            movieTitle.innerText = popularMovies[i].title;

            let newDiv = document.createElement('div');
            newDiv.appendChild(posterImg);
            newDiv.appendChild(movieTitle);

            tempMovies.push(newDiv);
        }
        // Grouping them by twos for display - appending them to the DOM
        for(let i = 0; i < tempMovies.length; i += 2){
            let doublePopularMovie = document.createElement('div');
            doublePopularMovie.classList.add('popularMovie');
            doublePopularMovie.classList.add('invisible');
            doublePopularMovie.classList.add('hidden');
            doublePopularMovie.appendChild(tempMovies[i]);
            doublePopularMovie.appendChild(tempMovies[i+1]);
            popularMoviesHtml.appendChild(doublePopularMovie);
        }
        let popularMoviesArray = document.getElementsByClassName("popularMovie");

        // Setting up the toggle display interval

        toggleHidden(popularMoviesArray[0]);
        let currentLocation = 0;
        setInterval(()=> {
            for(let i = 0; i < 2; i++){
                if(currentLocation >= popularMoviesArray.length){
                    currentLocation = 0;
                }
                toggleHidden(popularMoviesArray[currentLocation]);
                currentLocation++;
            }
            currentLocation -=1;
        }, 4000);
    }

    function toggleHidden(item){
        if(item.classList.contains('hidden')){ 
            setTimeout(()=>{
                item.classList.remove('hidden');
                item.classList.add('invisible');
                setTimeout(()=> {
                    item.classList.remove('invisible');
                }, 100);
            }, 750);
        }
        else{
            item.classList.add('invisible');
            setTimeout(()=>{
                item.classList.add('hidden');
                item.classList.remove('invisible');
            }, 750);
        }
        // if(item.classList.contains("invisible")){
        //     item.classList.remove("invisible");
        // }
        // else{
        //     item.classList.add("invisible");
        // }
    }

    function buildRecommendedMovies(recommendedMovies) {
        recommendedMoviesContainersArray = recommendedMovies.map((movie) => {
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
        newMoviePoster.setAttribute('alt', movie.title);
        newMoviePoster.setAttribute('title', movie.title);
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

    function showLoginError() {
        loginError.classList.remove("hiddenInPlace");
    }

    function hideLoginError() {
        loginError.classList.add("hiddenInPlace");
    }

    function hideLogin() {
        loginForm.classList.add("hidden");
        loginError.classList.remove("hiddenInPlace");
        loginError.classList.add("hidden");
        loggedInUser.classList.remove("hidden");
    }

    function showLogin() {
        loginForm.classList.remove("hidden");
        loginError.classList.add("hiddenInPlace");
        loginError.classList.remove("hidden");
        loggedInUser.classList.add("hidden");
        signOutBtn.classList.add("hidden");
    }

    function showSignOut() {
        signOutBtn.classList.remove("hidden");
    }
    async function showUser() {
        cognitoApi.getUsername((name) => {
            loggedInUserName = name;
            loggedInUser.innerText = loggedInUserName;
            hideLogin();
        });
    }

    function reset() {
        try {
            ratedMoviesCarousel.reset();
            recommendedMoviesCarousel.reset();
            searchMoviesCarousel.reset();
        } catch (error) {
            console.log(error);
        }
    }
    return {
        buildPopularMovies,
        buildMovieResults,
        buildRatedMovies,
        buildRecommendedMovies,
        showLoginError,
        hideLoginError,
        hideLogin,
        showLogin,
        showUser,
        showSignOut,
        reset
    }
})();

export default domManipulator;