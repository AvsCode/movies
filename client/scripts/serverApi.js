import cognitoApi from './cognitoApi.js';
import movieDbApi from './movieDbApi.js';

const serverApi = (function(){

    async function getMovieRatings(){
        let tempMovies = await cognitoApi.invokeApig({
            path: "/movies/getMovieRatings",
            method: "GET"
        });
        let recommendedMovies = await movieDbApi.queryMultiple(tempMovies.Items);
        return recommendedMovies;
    }
    function getMovieRatings2(){
        return cognitoApi.invokeApig({
                path: "/movies/getMovieRatings",
                method: "GET"
            });
    }
    async function createMovieRating(movie){
        console.log(await cognitoApi.invokeApig({
            path: "/movies/createMovieRating/",
            method: "POST",
            body: movie
        }));
    }
    async function deleteMovieRating(movie){
        console.log(await cognitoApi.invokeApig({
            path: "/movies/deleteMovieRating/",
            method: "DELETE",
            body: movie
        }));
    }
    return{
        createMovieRating,
        getMovieRatings,
        getMovieRatings2,
        deleteMovieRating
    }
})();
export default serverApi;