const mealsEl = document.querySelector("#meals");
const favoriteContainer = document.querySelector("#fav-meals");
const searchTerm = document.querySelector("#search-term");
const searchBtn = document.querySelector("#search");
const mealPopup = document.querySelector("#popup");
const popupCloseBtn = document.querySelector("#close-popup");
const mealInfoEl = document.querySelector("#meal-info");

getRandomMeal();
fetchFavMeal();

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}

async function getMealBySearch(term) {
  mealPopup;

  const respData = await resp.json();
  const meals = respData.meals;
  return meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
    <div class="meal-header">
        ${
          random
            ? `
        <span class="random">
        Random Recipe
        </span>`
            : ""
        }
        <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn" id="gp">
            <i class="fas fa-heart" id="like-button"></i>
        </button>
    </div>
  `;
  const btn = meal.querySelector(".fav-btn");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add("active");
    }

    fetchFavMeal();
  });
  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });
  mealsEl.appendChild(meal);
}

function addMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealLS(meal) {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeal() {
  //cleaning the fav
  favoriteContainer.innerHTML = "";
  const mealIds = getMealLS();
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-times-circle"></i></button>
  `;

  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeal();
  });

  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  //clean it update
  mealInfoEl.innerHTML = ``;
  //update meal instanceof
  const mealEl = document.createElement("div");
  //get ingiridents and measures
  const ingredients = [];
  for (let i = 1; i < 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEl.innerHTML = `
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="">
    <p>${mealData.strInstructions}</p>
    <h3>Ingredients</h3>
    <ul>
      ${ingredients
        .map(
          (ing) => `
      <li>${ing}</li>
      `
        )
        .join("")}
    </ul>
  `;
  mealInfoEl.appendChild(mealEl);
  //showing the popup
  mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  // cleaning favoriteContainer
  const search = searchTerm.value;
  const meals = await getMealBySearch(search);

  if (meals) {
    mealsEl.innerHTML = "";
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
