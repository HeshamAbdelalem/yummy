let dataHTML = document.querySelector('.data');

// #close aside bar

// $(document).ready(function () {
//   console.log('ready');
//   $('.loading-gear').fadeOut(2000);
//   $('body').css('overflow', 'visible');
//   $('.loading-gear').addClass('display', 'none');
// });

$(window).on('load', function () {
  $('.loading-gear').fadeOut(1000);
  console.log('ready');
});

// # habmorgur btn logic

let asideBar = document.querySelector('aside');
let closeOpenBtn = document.querySelector('.close-open-bar');

function closeOpenBtnFunc() {
  closeOpenBtn.addEventListener('click', () => {
    asideBar.classList.toggle('hide');
    if (!asideBar.classList.contains('hide')) {
      $('aside li').slideUp(50);
      document.querySelector('.close-open-bar i').classList.remove('fa-bars');
      document.querySelector('.close-open-bar i').classList.add('fa-xmark');
      $('aside li').slideDown(800);
    } else {
      document.querySelector('.close-open-bar i').classList.remove('fa-xmark');
      document.querySelector('.close-open-bar i').classList.add('fa-bars');
      $('aside li').slideUp(500);
    }
  });
}

function closeAsideBar() {
  if (!asideBar.classList.contains('hide')) {
    document.querySelector('.close-open-bar i').classList.remove('fa-xmark');

    document.querySelector('.close-open-bar i').classList.add('fa-bars');
    asideBar.classList.add('hide');
  }
}

closeOpenBtnFunc();

// # homepage meals

let mealsContainer = document.querySelector('.mealsContainer');

async function getMeals() {
  const request = await fetch(
    'https://www.themealdb.com/api/json/v1/1/search.php?s='
  );

  let response = await request.json();
  let meals = await response.meals;
  console.log(meals);
  return meals;
}

// # get meal when click

async function getOneMeal(id) {
  $(window).on('load', function () {
    $('.loading-gear').fadeOut(1000);
    console.log('ready');
  });
  console.log(id);
  closeAsideBar();

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  respone = await respone.json();

  displayMealDetails(respone.meals[0]);
}

function displayMealDetails(meal) {
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(',');
  // let tags = meal.strTags.split(",")
  if (!tags) tags = [];

  let tagsStr = '';
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  dataHTML.innerHTML = cartoona;
}

getMeals()
  .then((response) => {
    let html = '';
    for (let i = 0; i < response.length; i++) {
      console.log(response[i].strMeal);
      html += `
    <div onclick="getOneMeal('${response[i].idMeal}')"  class="meal p-2 rounded-2 col-sm-6 col-md-3 col-xl-2">
      <img src="${response[i].strMealThumb}" class="w-100 rounded-2 " alt="" />
      <div class="meal-showcase d-flex justify-content-center align-items-center ">
        <h4>${response[i].strMeal}</h4>
      </div>
    </div>
    `;
    }

    dataHTML.innerHTML = html;
  })
  .catch((err) => err);
