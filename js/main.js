"use strict";

//Elementos HTML
const searchInputEl = document.querySelector(".js_search_input");
const searchBtnEl = document.querySelector(".js_search_btn");
const resetBtnEl = document.querySelector(".js_reset_btn");
const seriesListEl = document.querySelector(".js_series_list");
const favListEl = document.querySelector(".js_fav_list");
const seriesListSection = document.querySelector(".js_series_list_section");
const favListSection = document.querySelector(".js_fav_list_section");


//Variables globales
let series = [];
let favSeries = [];

//Funciones

//Búsqueda
//Obtener datos del API y guardarlos en array
function getSeriesData() {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${searchInputEl.value}`)
    .then((response) => response.json())
    .then((data) => {
      series = data.results;
      showSeriesListSection();
      compare();
    });
}

//Recoger valor search input
function getSearchInputValue() {
  return searchInputEl.value;
}

//Comparar input value y data
function compare() {
  if (series) {
    for (let i = 0; i < series.length; i++) {
      const serie = series[i];
      renderSeriesList(serie);
    }
  } else {
    seriesListEl.innerHTML = `<p>Título no encontrado...</p>`;
  }
}

//Pintar listado de series
function getSeriesListHTMLCode(serie) {
  const htmlCode = `<li class ="results__item js_list_item" data-id = "${serie.mal_id}">${serie.title}
    <img class="results__image" src="${serie.image_url}" alt="Cartel de la serie" data-id = "${serie.mal_id}">
  </li>`;
  return htmlCode;
}

function showSeriesListSection() {
  seriesListSection.classList.remove('hidden');
}

function renderSeriesList() {
  let listSeriesCode = '';
  for (const serie of series) {
    listSeriesCode += getSeriesListHTMLCode(serie);
  }
  seriesListEl.innerHTML = listSeriesCode;
  listenListItems();
}

//Handler: añadir serie seleccionada a lista de favoritas
function handleClickFav(event) {

  //Modifico la apariencia de la serie seleccionada
  const clickedSeries = event.target;
  clickedSeries.classList.toggle('fav');

  //Obtengo el id de la serie seleccionada
  const selectedSeries = parseInt(event.target.dataset.id);

  //Busco la serie seleccionada en el array de favoritas
  let foundFav;
  for (const fav of favSeries) {
    if (fav.mal_id === selectedSeries) {
      foundFav = fav;
    }   
  }

  if (foundFav === undefined) {
      //Busco la serie seleccionada en el array 
  let foundSeries;
  for (const serie of series) {
    if (serie.mal_id === selectedSeries) {
      foundSeries = serie;
    }   
  }

  //Añado la serie seleccionada al array de favoritas
  favSeries.push(foundSeries);

  } else {

    //Elimino la serie del array de favoritas
    for (let i = 0; i < favSeries.length; i++) {
      favSeries.splice(foundFav[i], 1);
    }
  }

  showFavListSection();
  renderFavList();
  saveFavInLocalStorage();
}

//Handlers
function handleClickSearch(event) {
  event.preventDefault();
  getSeriesData();
}

//Eventos
searchBtnEl.addEventListener("click", handleClickSearch);

//Escuchar eventos en elementos de la lista de series
function listenListItems() {
  const listItemsEl = document.querySelectorAll('.js_list_item');

  for (const listItem of listItemsEl) {
    listItem.addEventListener('click', handleClickFav);
  }
}

//Pintar listado de favoritas
function getFavListHTMLCode(fav) {
  const htmlCode = `<li class ="favorites__item js_list_item" data-id = "${fav.mal_id}">${fav.title}
    <img class ="favorites__image" src="${fav.image_url}" alt="Cartel de la serie" data-id = "${fav.mal_id}">
  </li>`;
  return htmlCode;
}

function showFavListSection() {
  favListSection.classList.remove('hidden');
}

function renderFavList() {
  favListEl.innerHTML = '';
  for (const fav of favSeries) {
    favListEl.innerHTML += getFavListHTMLCode(fav);
  }
}

function saveFavInLocalStorage() {
  const favSeriesString = JSON.stringify(favSeries);
  localStorage.setItem('Favorite Series', favSeriesString);
}

function getFavFromLocalStorage() {
  const localStorageFavList = localStorage.getItem('Favorite Series');
  if (localStorageFavList !== null) {
    favSeries = JSON.parse(localStorageFavList);
    showFavListSection();
    renderFavList();
  }
}

getFavFromLocalStorage();