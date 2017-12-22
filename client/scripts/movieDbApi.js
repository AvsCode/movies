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
    async function queryMultiple(response){
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
        getMovieRecommendations
    }
})();

export default movieDbApi;