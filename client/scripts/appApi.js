import cognitoApi from './cognitoApi.js';
import serverApi from './serverApi.js';
import movieDbApi from './movieDbApi.js';
import domManipulator from './domManipulator.js';

const appApi = (function () {
    let movieSearchForm;
    let movieSearchResults = [];
    let ratedMovies = [];
    let recommendedMovies = [];
    let movieQuery;
    let loginForm;
    let userName;
    let password;
    let signOutBtn;

    async function setUp() {
        // Martialing all the DOM elements of interest
        movieSearchForm = document.getElementById("movieSearchForm");
        movieQuery = document.getElementById("movieSearchQuery");
        loginForm = document.getElementById("loginForm");
        userName = document.getElementById("userName");
        password = document.getElementById("userPassword");
        signOutBtn = document.getElementById("signOut");

        // Check if User has recently logged in:
        if(await cognitoApi.checkUserSignIn()){
            await domManipulator.showUser();
            domManipulator.showSignOut();
            loadCurrentUserMovies();
        }
        movieSearchForm.addEventListener("submit", submitMovieSearch);
        loginForm.addEventListener("submit", signIn);
        signOutBtn.addEventListener("click", signOut);
    }

    function signUp(event) {
        event.preventDefault();
        cognitoApi.signUp(userName.value, password.value);
    }

    function signIn(event){
        event.preventDefault();
        // Login via cognito - get previously rated movies - query movieDB for more comprehensive info - build the DOM elements with the results
        cognitoApi.signIn(userName.value, password.value)
        .then((responseStatus) => {
            console.log(responseStatus);
            if(responseStatus === 'Success'){
                return serverApi.getMovieRatings();
            }
            else{
                return;
            }
        })
        .then(movieDbApi.queryMultiple)
        .then((movies) => {
            // Hiding the login form
            domManipulator.hideLogin();
            domManipulator.showUser();
            domManipulator.showSignOut();
            setRatedMovies(movies);
            domManipulator.buildRatedMovies(ratedMovies);
            setTimeout(queryRecommendedMovies, 10000)
        })
        .catch((error) => {
            domManipulator.showLoginError();
            console.log(error);
        });
    }

    function signOut(event){
        console.log("hello2!");
        event.preventDefault();
        cognitoApi.signOut();
        domManipulator.reset();
    }

    function loadCurrentUserMovies(){
        serverApi.getMovieRatings()
        .then(movieDbApi.queryMultiple)
        .then((movies) => {
            domManipulator.hideLogin();
            setRatedMovies(movies);
            domManipulator.buildRatedMovies(ratedMovies);
            setTimeout(queryRecommendedMovies, 10000);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    async function submitMovieSearch(event) {
        event.preventDefault();
        movieSearchResults = await movieDbApi.queryDb(movieQuery.value);
        domManipulator.buildMovieResults(movieSearchResults);
    }

    function queryRecommendedMovies(){
        let recommendedMoviesObject = {};
        let positiveRatedMovies = [];
        let recommendedMoviesKeys = [];
        let randomRecommendedMovies;
        for(let i = 0; i < ratedMovies.length; i++){
            if(ratedMovies[i].movieRating >= 3 && positiveRatedMovies.length < 20){
                positiveRatedMovies.push(ratedMovies[i].movieId);
            }
        }
        movieDbApi.getMovieRecommendations(positiveRatedMovies)
        .then((recMovies) => {
            recMovies.map((movieArray) => {
                movieArray.map((movie) => {
                    if(!recommendedMoviesObject[movie.id]){
                        recommendedMoviesObject[movie.id] = movie;
                        recommendedMovies.push(movie);
                    }
                });
            });
            for(let i = 0; i < ratedMovies.length; i++){
                if(recommendedMoviesObject[ratedMovies[i].movieId]){
                    delete recommendedMoviesObject[ratedMovies[i].movieId];
                }
            }

            recommendedMoviesKeys = Object.keys(recommendedMoviesObject);

            recommendedMovies = recommendedMoviesKeys.map((movieId) => {
                return recommendedMoviesObject[movieId];
            });

            randomRecommendedMovies = getRandomRecommendedMovies();
            domManipulator.buildRecommendedMovies(randomRecommendedMovies);
        });
    }
    function getRandomRecommendedMovies(){
        let randomRecommendedMovies = [];
        let randomRecommendedMoviesObj = {};
        let randomIndex;
        for(let i = 0; i < 20; i++){
            randomIndex = Math.floor(Math.random() * recommendedMovies.length);
            console.log(randomIndex + " " + recommendedMovies[randomIndex]);
            randomRecommendedMovies.push(recommendedMovies[randomIndex]);
            randomRecommendedMoviesObj[recommendedMovies[randomIndex]] = true;
        }
        return randomRecommendedMovies;
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