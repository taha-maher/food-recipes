
let allData = [];
let httpReq = new XMLHttpRequest();
let showFilters = false ;
let globalIndex = 0;

const searchInp = document.getElementById("searchInp");
const searchButton = document.getElementById("search-button");
const filtersButton = document.getElementById("filters-button");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const closeButton = document.getElementById("close-button");
const navLinks = document.querySelectorAll(".nav a:not(.logo-img)");
const filtersModalLayer = document.querySelector(".filters-modal-layer");
const filtersModal = document.querySelector(".filters-modal");
const filtersLinks = document.querySelectorAll(".filters-modal li label");
const healthFilters = document.querySelectorAll("input[name='health']");
const dietFilters = document.querySelectorAll("input[name='diet']");
const recipesRow =  document.querySelector(".recipes-row");
const lightboxContainer = document.querySelector(".lightbox-container");

console

function checkFilters() {
    let healthFiltersParameter = "";
    let dietFiltersParameter = "";

    for (let i = 0; i < healthFilters.length; i++) {
        if (healthFilters[i].checked) {
            healthFiltersParameter += "&health=" + healthFilters[i].value;
        }
    }
    for (let i = 0; i < dietFilters.length; i++) {
        if (dietFilters[i].checked) {
            dietFiltersParameter += "&diet=" + dietFilters[i].value;
        }
    }

    return [healthFiltersParameter, dietFiltersParameter];
}


function getRecipes(term) {
    recipesRow.innerHTML = '<div class="loader"></div>';
    let filtersParametrs = checkFilters();
    httpReq.open("GET", `https://api.edamam.com/search?q=${term}&app_id=a50bd029&app_key=43b303e6ea22c3dd96676bdaae3330bf&from=0&to=20${filtersParametrs[0]}${filtersParametrs[1]}`)
    httpReq.send();
    httpReq.onreadystatechange = function () {
        if (httpReq.readyState == 4 && httpReq.status == 200) {
            allData = JSON.parse(httpReq.response).hits;
            displayRecipes();
        }
    }
}


function displayRecipes() {
    var temp = ``;
    for (var i = 0; i < allData.length; i++) {
        temp += `
        <div class="layer">
            <div id="${i}" class="recipe">
                <img src="${allData[i].recipe.image}">
                <h2>${allData[i].recipe.label}</h2>
                <p>${Math.round(allData[i].recipe.calories)} calories, ${allData[i].recipe.ingredientLines.length} ingredients</p>
                <button onClick="showLightBox(${i})">show more</button>
            </div>
        </div>`;

    }

    recipesRow.innerHTML = temp;
}

function showLightBox(indx) {
    lightboxContainer.style.transform = "scale(1,1)";
    lightboxContainer.firstElementChild.style.transform = "scale(1,1)";
    globalIndex = indx;
    editLightBox(indx);
}

function editLightBox(indx) {
    let recipe = allData[indx].recipe;
    let ingredientLines = "";
    for (i = 0; i < recipe.ingredientLines.length; i++) {
        ingredientLines += `<li>${recipe.ingredientLines[i]}</li>`;
    }

    let temp;
    temp = `
         <div class="details-img">
            <img src="${recipe.image}">
            <h2>${recipe.label}</h2>
            <h4>calories: ${Math.round(recipe.calories)}</h4>
            <p>Health Labels: ${recipe.healthLabels}.</p>
            <p>Diet Labels: ${recipe.dietLabels}.</p>
         </div>
         <div class="details-ingredients">
            <h4>ingredients:</h4>
            <ul>${ingredientLines}</ul>
        </div>
    `;
    document.querySelector(".recipe-details").innerHTML = temp;
}

function goNext() {
    globalIndex++;
    if (globalIndex == allData.length) {
        globalIndex = 0;
    }
    editLightBox(globalIndex);
}

function goPrev() {
    globalIndex--;
    if (globalIndex < 0) {
        globalIndex = allData.length - 1;
    }
    editLightBox(globalIndex);
}

function hideLightBox() {
    lightboxContainer.style.transform = "scale(0,0)";
    lightboxContainer.firstElementChild.style.transform = "scale(0,0)";

}

function showFiltersModal(){
    filtersModalLayer.style.transform = "scale(1,1)";
    filtersModal.style.transform = "scale(1,1)";
}

function hideFiltersModal(){
    filtersModalLayer.style.transform = "scale(0,0)";
    filtersModal.style.transform = "scale(0,0)";
}


for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function (e) {
        getRecipes(e.target.text)
    })
}

for(i=0 ; i<filtersLinks.length ; i++){
    filtersLinks[i].addEventListener("click" , function(e){
        let checkBox = e.target.parentElement.firstElementChild;
        checkBox.checked = !checkBox.checked;
    })
}

searchButton.addEventListener("click", function () {
    let term;
    if (searchInp.value.trim() == "") {
        term = "meat";
    }
    else {
        term = searchInp.value;
    }
    getRecipes(term);
})

searchInp.addEventListener("keydown", function (e) {
    let term;
    if (e.keyCode == 13) {
        if (searchInp.value.trim() == "") {
            term = "meat";
        }
        else {
            term = searchInp.value;
        }
        getRecipes(term);
    }
})

filtersButton.addEventListener("click", function () {
    if(showFilters){
        hideFiltersModal();
    }
    else{
        showFiltersModal();
    }
    showFilters = !showFilters;
    
})

filtersModalLayer.addEventListener("click",function(){
    showFilters  = false ;
    hideFiltersModal();
});

filtersModal.addEventListener("click", function (e) {
    let filters = checkFilters();
    if (filters[0] || filters[1]) {
        filtersButton.firstElementChild.style.display = "block";
    }
    else {
        filtersButton.firstElementChild.style.display = "none";
    }
})

lightboxContainer.addEventListener("click", hideLightBox)

lightboxContainer.firstElementChild.addEventListener("click", function (e) {
    e.stopPropagation()
})

nextButton.addEventListener("click", goNext);

prevButton.addEventListener("click", goPrev);

closeButton.addEventListener("click", hideLightBox);

document.addEventListener("keydown", function (e) {
    if(e.keyCode == 37){
        goPrev();
    }
    if(e.keyCode == 39){
        goNext();
    }
    if(e.keyCode == 27){
        hideLightBox();
    }
})

getRecipes("meat");

