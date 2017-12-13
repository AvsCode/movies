import cognitoApi from './cognitoApi.js';
import serverApi from './serverApi.js';
import movieDbApi from './movieDbApi.js';
import domManipulator from './domManipulator.js';

const appApi = (function () {
    let movieSearchForm;
    let movieSearchResults = [];
    let ratedMovies = [];
    let recommendedMovies = {};
    let recommendedMoviesDisplay = {};
    let windowWidthTimeout = false;
    let movieQuery;
    let movieListContainer;
    let movieSearchLeft;
    let movieSearchRight;
    let ratedMoviesContainer;
    let recommendedMoviesContainer;
    let loginForm;
    let userName;
    let password;

    function setUp() {

        // Martialing all the DOM elements of interest
        movieSearchForm = document.getElementById("movieSearchForm");
        movieQuery = document.getElementById("movieSearchQuery");
        movieListContainer = document.getElementById("displayedMovies");
        ratedMoviesContainer = document.getElementById("ratedMoviesContainer");
        recommendedMoviesContainer = document.getElementById("recommendedMoviesContainer");
        loginForm = document.getElementById("loginForm");
        userName = document.getElementById("userName");
        password = document.getElementById("userPassword");
        movieSearchLeft = document.getElementById("movieSearchLeft");
        movieSearchRight = document.getElementById("movieSearchRight");

        // Top level events - Login, search, windowResize (for updating number of displayed movies)
        window.addEventListener("resize", ()=>{
            clearTimeout(windowWidthTimeout);
            windowWidthTimeout = setTimeout(domManipulator.formatMovieLists, 100);
        });

        movieSearchLeft.addEventListener("click", (event) => {
            event.preventDefault();
            domManipulator.shiftSearchMovieList("left");
        });
        movieSearchRight.addEventListener("click", (event) => {
            event.preventDefault();
            domManipulator.shiftSearchMovieList("right");
        });

        movieSearchForm.addEventListener("submit", submitMovieSearch);
        loginForm.addEventListener("submit", signIn);
    }

    function signUp(event) {
        event.preventDefault();
        cognitoApi.signUp(userName.value, password.value);
    }

    function signIn(event){
        event.preventDefault();
        // Login via cognito - get previously rated movies - query movieDB for more comprehensive info - build the DOM elements with the results
        cognitoApi.signIn2(userName.value, password.value)
        .then(serverApi.getMovieRatings2)
        .then(movieDbApi.queryMultiple2)
        .then((movies) => {
            setRatedMovies(movies);
            domManipulator.buildRatedMovies(ratedMovies);
            queryRecommendedMovies();
        });

        loginForm.classList.add("hidden");
    }
    
    async function submitMovieSearch(event) {
        event.preventDefault();
        movieSearchResults = await movieDbApi.queryDb(movieQuery.value);
        domManipulator.buildMovieResults(movieSearchResults, movieListContainer);
    }

    function queryRecommendedMovies(){
        let positiveRatedMovies = [];
        for(let i = 0; i < ratedMovies.length; i++){
            if(ratedMovies[i].movieRating >= 3){
                positiveRatedMovies.push(ratedMovies[i].movieId);
            }
        }
        movieDbApi.getMovieRecommendations(positiveRatedMovies)
        .then((recMovies) => {
            recMovies.map((movieArray) => {
                movieArray.map((movie) => {
                    if(!recommendedMovies[movie.id]){
                        recommendedMovies[movie.id] = movie;
                    }
                });
            });
            for(let i = 0; i < ratedMovies.length; i++){
                if(recommendedMovies[ratedMovies[i].movieId]){
                    delete recommendedMovies[ratedMovies[i].movieId];
                }
            }
            domManipulator.buildRecommendedMovies(recommendedMovies);
        });
    }

    function setRatedMovies(movies){
        ratedMovies = movies;
    }
    function getRatedMovies(){
        return ratedMovies;
    }
    function getRecommendedMovies(){
        return recommendedMovies;
    }
    function getMovieSearchResults(){
        return movieSearchResults;
    }
    return {
        submitMovieSearch,
        setUp,
        setRatedMovies,
        getRatedMovies,
        getRecommendedMovies,
        getMovieSearchResults
    }

})();

export default appApi;