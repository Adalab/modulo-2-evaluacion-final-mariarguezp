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
      //renderSeriesList(series);
    });
}

// //Recoger valor search input
// function getSearchInputValue() {
//   return searchInputEl.value;
// }

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
  const htmlCode = `<li class ="results__item js_list_item" data-id = "${serie.mal_id}">
    <img class="results__image" src="${serie.image_url}" alt="Cartel de la serie">${serie.title}
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


// //Otra forma de hacerlo, usando DOM
// function renderSeriesList(series) {
// for (const eachSeries of series) {
//   //Creo el li
//   const seriesListItem = document.createElement('li');
//   //Creo el título
//   const seriesTitle = document.createTextNode(eachSeries.title);
//   //Creo la imagen
//   const seriesImage = document.createElement('img');
//   //Añado a la imagen el atributo src
//   seriesImage.setAttribute('src', eachSeries.image_url);
//   //Meto el li dentro del ul, y el título y la imagen dentro del li
//   seriesListEl.appendChild(seriesListItem);
//   seriesListItem.appendChild(seriesTitle);
//   seriesListItem.appendChild(seriesImage);
//   //Añado clases CSS
//   seriesListItem.classList.add('results__item');
//   seriesImage.classList.add('results__image')
// }
// }




//Handler: añadir serie seleccionada a lista de favoritas
function handleClickFav(event) {
  
  //Modifico la apariencia de la serie seleccionada
  const clickedSeries = event.currentTarget;
  clickedSeries.classList.toggle('fav');

  //Obtengo el id de la serie seleccionada
  const selectedSeries = parseInt(event.currentTarget.dataset.id);

  //Busco la serie seleccionada en el array de favoritas
  let foundFav;
  for (const fav of favSeries) {
    if (fav.mal_id === selectedSeries) {
      foundFav = fav;
    }   
  }
  //Si no está 
  if (foundFav === undefined) {
  //Busco la serie seleccionada en el array de resultados 
  let foundSeries;
  for (const serie of series) {
    if (serie.mal_id === selectedSeries) {
      foundSeries = serie;
    }   
  }

  //Añado la serie encontrada en el array de resultados al array de favoritas
  favSeries.push(foundSeries);

  } else {
    //Elimino la serie del array de favoritas
    const indexFav = favSeries.findIndex ((fav) => {
      return fav.mal_id === foundFav.mal_id 
    }) 
      favSeries.splice(indexFav, 1);
      
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
//Escuchar evento en botón 'Buscar'
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
  const htmlCode = `<li class ="favorites__item" data-id = "${fav.mal_id}">
  <span class="favorites__span"><img class ="favorites__image" src="${fav.image_url}" alt="Cartel de la serie">${fav.title}</span>
  <i class="fas fa-times-circle favorites__icon js_list_icon"></i>
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
  
  //Ocultar la lista si el array de favoritas está vacío
  if (favSeries.length === 0) {
    favListSection.classList.add('hidden');
  }

  listenFavListIcons();
}

//Local Storage
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
  } else {
  favListSection.classList.add('hidden');
  }
}

getFavFromLocalStorage();

//Handler: eliminar series de lista de favoritos al clickar en 'x'
function handleClickIcon(event) {
  //Obtengo el id de la serie seleccionada
  const selectedSeries = parseInt(event.currentTarget.parentElement.dataset.id);

  //Busco la serie seleccionada en el array de favoritas
  let foundFav;
  for (const fav of favSeries) {
    if (fav.mal_id === selectedSeries) {
      foundFav = fav;
    }   
  }
  //Si no está
  if (foundFav !== undefined) {
  //Elimino la serie seleccionada del array de favoritas
  const indexFav = favSeries.findIndex ((fav) => {
        return fav.mal_id === foundFav.mal_id 
      }) 
        favSeries.splice(indexFav, 1);

  }

  showFavListSection();
  renderFavList();
  saveFavInLocalStorage();
}

//Escuchar eventos en iconos de la lista de favoritas
function listenFavListIcons() {
  const favListIcons = document.querySelectorAll(".js_list_icon");

  for (const icon of favListIcons) {
    icon.addEventListener('click', handleClickIcon);    
  }
}

function handleClickReset(event) {
  event.preventDefault();
  searchInputEl.value = '';
  favSeries = [];
  series = [];
  localStorage.removeItem('Favorite Series');
  seriesListSection.classList.add('hidden');
  favListSection.classList.add('hidden');

  renderFavList();
  renderSeriesList();
}

resetBtnEl.addEventListener("click", handleClickReset);