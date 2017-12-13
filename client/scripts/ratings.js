import serverApi from './serverApi.js';
import appApi from './appApi.js';
import domManipulator from './domManipulator.js';

export function highLightStarRatingClickHandler(event) {
    event.target.classList.add("rated");

    let previousStar = event.target.previousElementSibling;
    let nextStar = event.target.nextElementSibling;

    while (previousStar != null) {
        previousStar.classList.add("rated");
        previousStar = previousStar.previousElementSibling;
    }
    while (nextStar != null) {
        nextStar.classList.remove("rated");
        nextStar = nextStar.nextElementSibling;
    }
}

export function highLightRatingOnHover(event){
    event.target.classList.add('hover');

    let previousStar = event.target.previousElementSibling;
    let nextStar = event.target.nextElementSibling;

    while (previousStar != null) {
        if(!previousStar.classList.contains("rated")){
            previousStar.classList.add("hover");
        }
        previousStar = previousStar.previousElementSibling;
    }
    while (nextStar != null) {
        nextStar.classList.remove("hover");
        nextStar = nextStar.nextElementSibling;
    }
}

export function unHilightRating(event){
    event.target.classList.remove('hover');
    let previousStar = event.target.previousElementSibling;
    let nextStar = event.target.nextElementSibling;
    while(previousStar != null){
        previousStar.classList.remove("hover");
        previousStar = previousStar.previousElementSibling;
    }
    while(nextStar != null){
        nextStar.classList.remove("hover");
        nextStar = nextStar.nextElementSibling;
    }
}

export function submitRatedMovie(event) {
    let selectedMovie = event.target.parentElement.parentElement;
    let selectedRating = event.target.getAttribute('rating');
    let movieId = selectedMovie.getAttribute('movieId');
    let movieTitle = selectedMovie.getAttribute('movieTitle');

    let recommendedMovies = appApi.getRecommendedMovies();
    let ratedMovies = appApi.getRatedMovies();
    let searchMovies = appApi.getMovieSearchResults;

    let tempMovie = {
        movieId,
        movieRating: selectedRating,
        movieTitle
    };


    let newMovieRating = true;
    let newMovie = true;
    let movieIndex;
    // Check if movie Already exists in our rated movies
    ratedMovies.forEach((movie, index) => {
        if(movie.movieId == tempMovie.movieId){
            // If the new rating is the same as the existing rating we delete the movie
            if(movie.movieRating == tempMovie.movieRating){
                serverApi.deleteMovieRating(tempMovie);
                newMovieRating = false;
            }
            newMovie = false;
            movieIndex = index;
        }
    });
    // If we have a new movie rating on an existing movie, we update the rating
    if(newMovieRating  && !newMovie){
        serverApi.createMovieRating(tempMovie);
        ratedMovies[movieIndex].movieRating = tempMovie.movieRating;
    }
    // if we have an entirely new movie we add it to our rated movies
    else if(newMovie){
        serverApi.createMovieRating(tempMovie);
        tempMovie = recommendedMovies[tempMovie.movieId] ? recommendedMovies[tempMovie.movieId] : searchMovies[tempMovie.movieId];
        tempMovie.movieRating = selectedRating;
        ratedMovies.push(tempMovie);
    }
    else{
        ratedMovies.splice(movieIndex, 1);
    }
    domManipulator.buildRatedMovies(appApi.getRatedMovies());
}