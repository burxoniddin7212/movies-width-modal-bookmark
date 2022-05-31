//query elements from HTML
let elForm = $(".js-form");
let elSearchInput = $(".js-search-input", elForm);
let elSearchReytingInput = $(".js-search-reyting-input", elForm);
let elSearchSelectCategories = $("#categories", elForm);
let elSearchSort = $("#tartib", elForm);
let elOkbtn = $(".js-form-btn", elForm);
let elKinolarList = $(".js-kinolar-list");
let sectionn = $(".div-div-modal");
let elTemplate = $("#js-template").content;
let elTemplatemodal = $("#js-template-modal").content;



let sortMovies = [];

movies.splice(100);
//Nusxa olish
let normalizeMovies =  movies.map((movie, i) =>{
  return {
    id: i,
    title: movie.Title.toString(),
    fulltitle: movie.fulltitle,
    categories: movie.Categories.split("|").join(", "),
    summary: movie.summary,
    movie_year: movie.movie_year,
    imdb_rating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    imdb_id: movie.imdb_id,

    trailer: `https://www.youtube.com/watch?v=${movie.ytid}`,
    smallPoster: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    bigPoster: `https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`
  }
}) 

//Tamplatega qiymatlar berish funksiyasi
let logMovies = function(film){
  let elTemplateClone = elTemplate.cloneNode(true);
  
  $(".js-kino-img", elTemplateClone).src = film.smallPoster;
  $(".js-kino-img", elTemplateClone).alt = film.title;
  $(".js-kino-title", elTemplateClone).textContent = `Title: ${film.title}`;
  $(".js-kino-movie-year", elTemplateClone).textContent =`Year: ${film.movie_year}`;
  $(".js-kino-categories", elTemplateClone).textContent = `Categories: ${film.categories}`;
  $(".js-kino-reytinggi", elTemplateClone).textContent = `Reyting: ${film.imdb_rating}`;
  $(".js-kino-trailer", elTemplateClone).href = film.trailer;
  $(".btn-modal-modal", elTemplateClone).id = film.id;
  $(".btn-modal-modal", elTemplateClone).setAttribute("data-bs-target", `#aa${film.id}`);
  $(".js-kinolar-item", elTemplateClone).dataset.imdbid = film.imdb_id;

  return elTemplateClone;
}

//Render funkisyasi
let renderKinolar = function(a){
  elKinolarList.innerHTML = "";
  let fragment = document.createDocumentFragment();

  a.forEach((film) => {
    fragment.appendChild(logMovies(film));
  })
  elKinolarList.append(fragment);
}
renderKinolar(normalizeMovies);


//Kategoryalarni topish funksiyasi 
let numberCategorie = [];
let numberCategories = function(){
  
  normalizeMovies.forEach((movie) => {
    movie.categories.split(", ").forEach((categori) => {
      if(!numberCategorie.includes(categori)){
        numberCategorie.push(categori);
      }
    })
  })

  numberCategorie.sort();
  numberCategorie.unshift("All");
   return numberCategorie
}
numberCategories();


//Categoria boyicha opshin yaratish function
numberCategorie.forEach((categoria) => {
  let newOption = document.createElement("option");
  newOption.textContent = categoria;
  newOption.value = categoria;
  newOption.name = categoria;

  elSearchSelectCategories.append(newOption);
})


//Function Alifbo va reyting boyicha tartiblashda optionlar yaratish chiqarish
let selectOptionCreat = ["A-Z", "Z-A", "Reytingi =>", "Reytingi <=", "Yil =>", "Yil <="];

for(i = 0; i <= selectOptionCreat.length; i++){
  let elSortTitleOption = document.createElement("option");
  elSortTitleOption.textContent = selectOptionCreat[i];
  elSortTitleOption.value = selectOptionCreat[i];

  elSearchSort.append(elSortTitleOption);
}


//search render
let renderSearch = function(moviesArry){
  if(elSearchInput.value != "" && elSearchInput.value != null){
    const search = new RegExp(elSearchInput.value, "gi")
    readyMoviesArr =  moviesArry.filter((film) => {
      return (film.title.match(search))
    })
  }
  else{
    readyMoviesArr = moviesArry;
  }

  if(elSearchReytingInput.value != "" && !isNaN(parseFloat(elSearchReytingInput.value))){
    
    readyMoviesArr = readyMoviesArr.filter((film) => {
      return( parseFloat(elSearchReytingInput.value) <= film.imdb_rating)
    })
  }

  if(elSearchSelectCategories.value !== "" && elSearchSelectCategories.value !== "All"){
    let searchRegExCategory = new RegExp(elSearchSelectCategories.value, "gi");
    readyMoviesArr = readyMoviesArr.filter((film) => {
      return film.categories.match(searchRegExCategory);
    })
  }


  if(elSearchSort.value !== ""){

    if(elSearchSort.value == "A-Z"){
    sortMovies = readyMoviesArr.sort((a, b)=> a.title.localeCompare(b.title))
    }

    if(elSearchSort.value == "Z-A"){
      sortMovies = readyMoviesArr.sort((a,b)=> b.title.localeCompare(a.title))
      }

    if(elSearchSort.value == "Reytingi =>"){
      sortMovies  = readyMoviesArr.sort(function(a,b) {
       return a.imdb_rating - b.imdb_rating
      })
    }

    if(elSearchSort.value == "Reytingi <="){
      sortMovies  = readyMoviesArr.sort(function(a,b) {
       return b.imdb_rating - a.imdb_rating
      })
    }


    if(elSearchSort.value == "Yil =>"){
      sortMovies  = readyMoviesArr.sort(function(a,b) {
        return a.movie_year - b.movie_year
       })
    }

    if(elSearchSort.value == "Yil <="){
      sortMovies  = readyMoviesArr.sort(function(a,b) {
        return b.movie_year - a.movie_year
       })
    }

        readyMoviesArr = [];
        readyMoviesArr = sortMovies;
  }

  return readyMoviesArr
}


elOkbtn.addEventListener("click", function(evt) {
  evt.preventDefault();

  renderKinolar(renderSearch(normalizeMovies));
})


//Modal chiqarish  
let logMoviesModal = function(){
  let fragmentModal = document.createDocumentFragment();

  normalizeMovies.forEach((film) => {

    let elTemplateModalClone = elTemplatemodal.cloneNode(true);

    $(".js-film-summary", elTemplateModalClone).textContent = film.summary;
    $(".div-modal", elTemplateModalClone).id = `aa${film.id}`;

    fragmentModal.append(elTemplateModalClone);
  
  })
  
  sectionn.append(fragmentModal);

}

logMoviesModal();

;
//Bookmark qoshish
let bookMarkArry = JSON.parse(localStorage.getItem("film")) || [];
let elTemplateBookmark = $(".bookmark-template").content;


//Render bookmark
let renderBookmark = function(arry){
  $(".js-bookmark-list").innerHTML = "";
  let fragmentBookmark = document.createDocumentFragment();

  arry.forEach((film) => {
    let elTemplateBookmarkClone =  elTemplateBookmark.cloneNode(true);

    $(".js-bookmark-title", elTemplateBookmarkClone).textContent = film.title;
    $(".bookmark-btn-delete", elTemplateBookmarkClone).dataset.Id = film.imdb_id;
    $(".js-bokkmark-item", elTemplateBookmarkClone).dataset.tartib = `id-${film.id}`;
    

    fragmentBookmark.appendChild(elTemplateBookmarkClone);
  })
  $(".js-bookmark-list").appendChild(fragmentBookmark);
}

renderBookmark(bookMarkArry);


$(".js-kinolar-list").addEventListener("click", (evt) => {
  evt.preventDefault();
 
  if(evt.target.matches(".js-bookmark-btn")){
    let findImdbId = evt.target.closest(".js-kinolar-item").dataset.imdbid;
    let findFilmWidthImdbId = normalizeMovies.find(item => item.imdb_id == findImdbId)

    if(!bookMarkArry.includes(findFilmWidthImdbId)){
    bookMarkArry.push(findFilmWidthImdbId);
    localStorage.setItem("film", JSON.stringify(bookMarkArry));
    }

  }

  renderBookmark(bookMarkArry);
})


  $(".js-bookmark-list").addEventListener("click", (evt) => {
    evt.preventDefault();

    if(evt.target.matches(".bookmark-btn-delete")){
     let findIdDelete = evt.target.closest(".js-bokkmark-item").dataset.tartib;
     let findBookmarIndexfor = bookMarkArry.findIndex((film) => {
       return `id-${film.id}` == findIdDelete
     })
     bookMarkArry.splice(findBookmarIndexfor,1);
     renderBookmark(bookMarkArry);
     localStorage.setItem("film", JSON.stringify(bookMarkArry));
    }
  })
