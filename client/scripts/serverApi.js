import cognitoApi from './cognitoApi.js';
import movieDbApi from './movieDbApi.js';

const serverApi = (function(){

    function getMovieRatings(){
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
        deleteMovieRating
    }
})();
export default serverApi;