import cognitoConfig from '../../secrets/cognitoConfig';
const movieDbApi = (function(){
    let apiKey = cognitoConfig.API_KEY;
    let searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
    let singleMovieUrl = 'https://api.themoviedb.org/3/movie/';
    
    async function queryDb(movieQuery){
        return fetch(searchUrl + movieQuery, {method: 'GET'})
        .then((response) => {
            return response.json()
        }).then((response)=>{
            return response.results;
        });
    }
    async function queryMultiple(movieList){
        console.log(movieList);
        let moviePromises = movieList.map((movie) => {
            return fetch(singleMovieUrl + movie.movieId + '?api_key=' + apiKey + '&language=en-US', {method: 'GET'})
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return response;
            });
        });
        return Promise.all(moviePromises)
        .then((movies) => {
            console.log(movies);
            return movies;
        });
    }
    async function queryMultiple2(response){
        let movieList = response.Items;
        let moviePromises = movieList.map((movie) => {
            return fetch(singleMovieUrl + movie.movieId + '?api_key=' + apiKey + '&language=en-US', {method: 'GET'})
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                movie = {...movie, ...response};
                return movie;
            });
        });
        return Promise.all(moviePromises);
    }

    async function getMovieRecommendations(positiveRecommendedMovies){
        let recommendedMoviePromises = positiveRecommendedMovies.map((movieId)=>{
            return fetch(`${singleMovieUrl}${movieId}/recommendations?api_key=${apiKey}&language=en-US`, {method:'GET'})
            .then((response)=>{
                return response.json();
            })
            .then((response)=>{
                return response.results;
            });
        });
        return Promise.all(recommendedMoviePromises);
    }
    return {
        queryDb,
        queryMultiple,
        queryMultiple2,
        getMovieRecommendations
    }
})();

export default movieDbApi;