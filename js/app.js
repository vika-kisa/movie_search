const API_KEY = "e1a6538e-40dd-4a56-864e-b3cfed1073c4" ;
const API_URL = "https://kinopoiskapiunofficial.tech/api"
// const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?";
// const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="
const PAGE_KEY = 'page';
const SEARCH_KEY = 'search';

const nextPageBtn = document.querySelector ('.pagination .nextPage');
const prevPageBtn = document.querySelector ('.pagination .prevPage'); 

let pagination = {};
let searchValue = '';
initSearchParams(); 

function initSearchParams() {
    const url = new URL(window.location.href);
    const search_params = url.searchParams;

    searchValue = search_params.get (SEARCH_KEY) || '';
    pagination = {
        total: 0,
        page: Number (search_params.get(PAGE_KEY)) || 1,
        perPage: 20
    }
    if (searchValue) {
        searchMovies().then(showMovies);
    } else {
        getMovies().then(showMovies);
    }
}

function fetchRequest(method, params) {
    const query = params ? '?' + Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])) //чтоб ссылка записывалась в нужном формате с параметрами
      .join('&') : '';

    return fetch(API_URL + method + query, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
}

async function getMovies() { // для показа топ 100 фильмов 
    return (await fetchRequest('/v2.2/films/top', {
       page: pagination.page,
       type: 'TOP_100_POPULAR_FILMS',
    })).json;
}

async function searchMovies() { // для поиска фильмов в форме
    return (await fetchRequest('/v2.1/films/search-by-keyword',{
        page: pagination.page,
        keyword: searchValue
    })).json();
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
    pagination.total = data.pagesCount;
    const moviesEl = document.querySelector (".movies");

    document.querySelector(".movies").innerHTML=""; //очищает предыдущие фильмы

    data.films.forEach((movie) => {
        movie.rating = movie.rating || '';
        let numberOfRating = movie.rating.includes("%") ? Math.round (movie.rating.replace("%"," ")/10) : movie.rating; //округление, если число в %
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
    
    if (pagination.page <=1 ){
        prevPageBtn.classList.add ('hidden');
    } else if (pagination.page >= pagination.total){
        nextPageBtn.classList.add ('hidden');
    }
}

nextPageBtn.addEventListener('click',() => updateQueryString(PAGE_KEY, pagination.page + 1))
prevPageBtn.addEventListener('click', () => updateQueryString(PAGE_KEY, pagination.page - 1))

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) =>{
    pagination.page = 1;
    e.preventDefault(); //чтоб не было перезагрузки страницы 
    updateQueryString(SEARCH_KEY, search.value);
})

function updateQueryString(key,value) {
    const url = new URL(window.location.href);
    const search_params = url.searchParams;
    
    search_params.set (key,value);
    if (key === SEARCH_KEY){
        search_params.set(PAGE_KEY, 1)
    }
    window.location.search = search_params.toString();
}
