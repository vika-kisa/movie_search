const API_KEY = "e1a6538e-40dd-4a56-864e-b3cfed1073c4" ;
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}


function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    } else if (vote > 5) {
        return "orange";
    } else {
        return "red"; 
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector (".movies");

    document.querySelector(".movies").innerHTML=""; //очищает предыдущие фильмы

    data.films.forEach((movie) => {
        let numberOfRating = movie.rating.includes("%") ? Math.round (movie.rating.replace("%"," ")/10) : movie.rating;
        const movieEl = document.createElement ("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
            <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movie__cover">
            <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
                (genre) => ` ${genre.genre}`
            )}</div>
            ${(movie.rating && movie.rating !== "null") ?  `
            <div class="movie__average movie__average--${getClassByRate(numberOfRating)}">${numberOfRating}</div>
            `:""
            }
        </div>
        `;
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) =>{
    e.preventDefault(); //чтоб не было перезагрузки страницы 

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}` 
    if (search.value) {
        getMovies(apiSearchUrl);
        search.value = "";
    }
})