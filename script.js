const d = document,
  $mainScreen = d.querySelector(".main-screen"),
  $pokeName = d.querySelector(".poke-name"),
  $pokeId = d.querySelector(".poke-id"),
  $pokeFrontImage = d.querySelector(".poke-front-image"),
  $pokeBackImage = d.querySelector(".poke-back-image"),
  $pokeTypeOne = d.querySelector(".poke-type-one"),
  $pokeTypeTwo = d.querySelector(".poke-type-two"),
  $pokeWeight = d.querySelector(".poke-weight"),
  $pokeHeight = d.querySelector(".poke-height"),
  $pokeListItem = d.querySelectorAll(".list-item"),
  $leftButton = d.querySelector(".left-button"),
  $rightButton = d.querySelector(".right-button");

//Constants and Variables

const Types = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

let prevUrl = null;
let nextUrl = null;

//functions

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
  $mainScreen.classList.remove("hide");

  for (const type of Types) {
    $mainScreen.classList.remove(type);
  }
};

const fetchPokeList = (url) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { results, previous, next } = data;

      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < $pokeListItem.length; i++) {
        const pokeListItem = $pokeListItem[i],
          resultData = results[i];

        if (resultData) {
          const { name, url } = resultData,
            urlArray = url.split("/"),
            id = urlArray[urlArray.length - 2];

          pokeListItem.textContent = id + "." + capitalize(name);
        } else {
          pokeListItem.textContent = "";
        }
      }
    });
};

const fetchPokeData = (id) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => {
      resetScreen();

      const dataTypes = data["types"],
        dataFirstType = dataTypes[0],
        dataSecondType = dataTypes[1];

      $pokeTypeOne.textContent = capitalize(dataFirstType["type"]["name"]);

      if (dataSecondType) {
        $pokeTypeTwo.classList.remove("hide");
        $pokeTypeTwo.textContent = capitalize(dataSecondType["type"]["name"]);
      } else {
        $pokeTypeTwo.classList.add("hide");
        $pokeTypeTwo.textContent = "";
      }

      $mainScreen.classList.add(dataFirstType["type"]["name"]);

      $pokeName.textContent = capitalize(data["name"]);
      $pokeId.textContent = "#" + data["id"].toString().padStart(3, "0");
      $pokeWeight.textContent = data["weight"];
      $pokeHeight.textContent = data["height"];
      $pokeFrontImage.src = data["sprites"]["front_default"] || "";
      $pokeBackImage.src = data["sprites"]["back_default"] || "";
    });
};

const handleLeftClick = () => {
  if (prevUrl) fetchPokeList(prevUrl);
};

const handleRightClick = () => {
  if (nextUrl) fetchPokeList(nextUrl);
};

const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split(".")[0];
  fetchPokeData(id);
};

//Event Listeners

$leftButton.addEventListener("click", handleLeftClick);
$rightButton.addEventListener("click", handleRightClick);

for (const pokeListItem of $pokeListItem) {
  pokeListItem.addEventListener("click", handleListItemClick);
}

//Initialize App

fetchPokeList("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
