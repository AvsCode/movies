import cognitoConfig from '../../secrets/cognitoConfig';
const movieDbApi = (function () {
    const apiKey = cognitoConfig.API_KEY;
    const searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
    const popularUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=' + apiKey + "&language=en-US&page=1";
    const singleMovieUrl = 'https://api.themoviedb.org/3/movie/';

    async function queryDb(movieQuery) {
        return fetch(searchUrl + movieQuery, {
                method: 'GET'
            })
            .then((response) => {
                return response.json()
            }).then((response) => {
                return response.results;
            });
    }
    async function queryMultiple(response) {
        let movieList = response.Items;
        let moviePromises = movieList.map((movie) => {
            return fetch(singleMovieUrl + movie.movieId + '?api_key=' + apiKey + '&language=en-US', {
                    method: 'GET'
                })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    movie = { ...movie,
                        ...response
                    };
                    return movie;
                });
        });
        return Promise.all(moviePromises);
    }
    async function getMovieRecommendations(positiveRecommendedMovies) {
        let recommendedMoviePromises = positiveRecommendedMovies.map((movieId) => {
            return fetch(`${singleMovieUrl}${movieId}/recommendations?api_key=${apiKey}&language=en-US`, {
                    method: 'GET'
                })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    return response.results;
                });
        });
        return Promise.all(recommendedMoviePromises);
    }
    async function getPopularMovies() {
        return fetch(popularUrl, {
                method: 'GET'
            })
            .then((response) => {
                return response.json()
            }).then((response) => {
                return response.results;
            });
    }
    return {
        queryDb,
        queryMultiple,
        getMovieRecommendations,
        getPopularMovies
    }
})();

export default movieDbApi;