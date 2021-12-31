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
  const htmlCode = `<li class = "js_list_item" data-id = "${serie.mal_id}">${serie.title}
    <img src="${serie.image_url}" alt="Cartel de la serie" data-id = "${serie.mal_id}">
  </li>`;
  return htmlCode;
}

function showSeriesListSection() {
  seriesListSection.classList.toggle('hidden');
}

function renderSeriesList() {
  let listSeriesCode = "";
  for (const serie of series) {
    listSeriesCode += getSeriesListHTMLCode(serie);
  }
  seriesListEl.innerHTML = listSeriesCode;
  listenListItems();
}

//Escuchar eventos en elementos de la lista de series
function listenListItems() {
  const listItemsEl = document.querySelectorAll('.js_list_item');

  for (const listItem of listItemsEl) {
    listItem.addEventListener('click', handleClickFav);
  }
}

//Handler: añadir serie seleccionada a lista de favoritas
function handleClickFav(event) {
  console.log(series, event.target.dataset.id);
  const selectedSeries = parseInt(event.target.dataset.id);
  let foundSeries;
  for (const serie of series) {
    if (serie.mal_id === selectedSeries) {
      foundSeries = serie;
    }    
  }
  favSeries.push(foundSeries);
}

//Handlers
function handleClickSearch(event) {
  event.preventDefault();
  getSeriesData();
}

//Eventos
searchBtnEl.addEventListener("click", handleClickSearch);
