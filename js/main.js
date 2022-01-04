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
      // compare();
      renderSeriesList();
    });
}

//ESTA FUNCIÓN NO SIRVE PARA NADA, porque esto ya lo hace el fetch!!!!!!!!!!!!!!!!!!!!!!!!!!!
//Comparar búsqueda y array de resultados, y pintar resultados o no (ejecuto arriba)
// function compare() {
//   if (series) {
//     for (let i = 0; i < series.length; i++) {
//       const serie = series[i];
//       renderSeriesList(serie);
//     }
//     //Otra forma de hacerlo, usando un for of
//     // for (const serie of series) {
//     //   renderSeriesList(serie);
      
//     // }
//   } else {
//     seriesListEl.innerHTML = `<p>Título no encontrado...</p>`;
//   }
// }

//Pintar listado de resultados
function getSeriesListHTMLCode(serie) {
  const htmlCode = `<li class ="results__item js_list_item" data-id = "${serie.mal_id}">
    <img class="results__image" src="${serie.image_url}" alt="Cartel de la serie">${serie.title}
  </li>`;
  return htmlCode;
}

function renderSeriesList() {
  let listSeriesCode = '';
  for (const serie of series) {
    listSeriesCode += getSeriesListHTMLCode(serie);
  }
  seriesListEl.innerHTML = listSeriesCode;
  //Ejecuto la función aquí, porque es cuando los items de la lista ya están pintados, hasta este momento no existen en el HTML
  listenListItems();
}

//Mostrar listado de resultados
function showSeriesListSection() {
  seriesListSection.classList.remove('hidden');
}

//Handler: al clickar en 'Buscar' ejecuto la función de fetch
function handleClickSearch(event) {
  event.preventDefault();
  getSeriesData();
}

//Favoritos
//Handler: añadir serie seleccionada a lista de favoritas
function handleClickFav(event) {
  //Obtengo el elemento escuchado para modificar su apariencia
  const clickedSeries = event.currentTarget;
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
  //Añado la serie encontrada al array de favoritas
  favSeries.push(foundSeries);
  //Y modifico su apariencia añadiendo la clase 'fav'
  clickedSeries.classList.add('fav');
  } else {
    //Si ya está en el array de favoritas la elimino
    const indexFav = favSeries.findIndex ((fav) => {
      return fav.mal_id === foundFav.mal_id 
    })
    //Otra forma de escribir la función sin usar arrow function
    // const indexFav = favSeries.findIndex(
    //   function findFavIndex(fav) {
    //     return fav.mal_id === foundFav.mal_id;
    //   }
    // )
      favSeries.splice(indexFav, 1);
      //Y modifico su apariencia eliminando la clase 'fav'
      clickedSeries.classList.remove('fav');
  }
  //Muestro la lista de resultados, la pinto y la guardo en el local store
  showFavListSection();
  renderFavList();
  saveFavInLocalStorage();
}

//Pintar listado de favoritas
function getFavListHTMLCode(fav) {
  const htmlCode = `<li class ="favorites__item" data-id = "${fav.mal_id}">
  <span class="favorites__span"><img class ="favorites__image" src="${fav.image_url}" alt="Cartel de la serie">${fav.title}</span>
  <i class="fas fa-times-circle favorites__icon js_list_icon"></i>
</li>`;
  return htmlCode;
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
  //Escucho la función aquí, porque es cuando los elementos escuchados ya están pintados
  listenFavListIcons();
}

//Mostrar lista de favoritas
function showFavListSection() {
  favListSection.classList.remove('hidden');
}

//Local Storage
//Guardo el array de favoritas en el local store, convirtiéndolo en string
function saveFavInLocalStorage() {
  const favSeriesString = JSON.stringify(favSeries);
  localStorage.setItem('Favorite Series', favSeriesString);
}

//Obtengo los datos guardados en el local store, convirtiéndolos en array, y pinto la lista
function getFavFromLocalStorage() {
  const localStorageFavList = localStorage.getItem('Favorite Series');
  if (localStorageFavList !== null) {
    favSeries = JSON.parse(localStorageFavList);
    showFavListSection();
    renderFavList();
  } else {
  //Si el local store está vacío oculto la lista de favoritas
  favListSection.classList.add('hidden');
  }
}

//Bonus
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
  //Si está
  if (foundFav !== undefined) {
  //Elimino la serie seleccionada del array de favoritas
  const indexFav = favSeries.findIndex ((fav) => {
        return fav.mal_id === foundFav.mal_id 
      }) 
        favSeries.splice(indexFav, 1);
  }
  //Pinto la lista y guardo en local store
  showFavListSection();
  renderFavList();
  saveFavInLocalStorage();
}

//Handler: al clickar en el botón 'Reset' vacío el input, los arrays, el local store y oculto las listas
function handleClickReset(event) {
  event.preventDefault();
  searchInputEl.value = '';
  favSeries = [];
  series = [];
  localStorage.removeItem('Favorite Series');
  seriesListSection.classList.add('hidden');
  favListSection.classList.add('hidden');
  //Pinto las listas para que me las oculte
  renderFavList();
  renderSeriesList();
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

//Escuchar eventos en iconos de la lista de favoritas
function listenFavListIcons() {
  const favListIcons = document.querySelectorAll(".js_list_icon");

  for (const icon of favListIcons) {
    icon.addEventListener('click', handleClickIcon);    
  }
}

//Ecuchar evento en el botón 'Reset'
resetBtnEl.addEventListener("click", handleClickReset);

//Cargar página
//Ejecuto la función que obtiene los datos del local store, para que me los pinte al cargar la página
getFavFromLocalStorage();