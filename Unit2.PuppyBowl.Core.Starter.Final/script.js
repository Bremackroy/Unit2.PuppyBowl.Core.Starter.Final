// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2404-FTB-MT-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

const state = {
  players: [],
  player: null
}

const addForm = document.querySelector("#new-player-form")
const playerContainer = document.getElementsByTagName("main")[0]

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const request = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`)
    const response = await request.json()
    //Saving to State
    state.players = response.data;
    return response.data.players;
    //returning to later
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
//Youtube 41:59
const fetchSinglePlayer = async (playerId) => {

  try {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/${playerId}`)
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
      const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(playerObj),
      });
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    } catch (err) {
      console.error("Oops, something went wrong with adding that player!", err);
    }
  };
/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const request = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/#${playerId}`,{
      method:"DELETE"
    }); 
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

console.log(fetchAllPlayers());

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  console.log("in render function, from parameters", playerList)
  console.log("in render function, from state", state.players)
  const holders = []

  for(let i = 0; i<playerList.length;i++){


    const playerHolder = document.createElement("div")
    
    const nameEl = document.createElement("h2")
    const imgEl = document.createElement("img")
    const viewButton = document.createElement("button")
    const deleteButton = document.createElement("button")
    
    viewButton.textContent = "View my Description"
    deleteButton.textContent = "Delete this Player"
    nameEl.textContent = playerList[i].name
    imgEl.setAttribute("src", playerList[i].imageUrl)
    imgEl.setAttribute("alt", "This is an picture of "+playerList[i].name)
    console.log(playerList[i].name)

    //getting promise for this async/fetch
    viewButton.addEventListener("Click",async (e)=>{
    })

    deleteButton.addEventListener("click", ()=>{
      removePlayer(playerList[i].id)
    })

    playerHolder.append(nameEl, imgEl, viewButton, deleteButton)
    holders.push(playerHolder)
  }

  playerContainer.replaceChildren(...holders)

};

//console.log(renderAllPlayers)

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  console.log("rendering single player:", player);
  const article = document.createElement("article");
  article.classList.add("player");

  const backToPlayersBtn = document.createElement("button");
  backToPlayersBtn.textContent = "Back to All Players";
  backToPlayersBtn.addEventListener("click", function() {
    window.location.href = "index.html";
  });

  const heading = document.createElement("h3");
  heading.textContent = player.name;

  const paragraph1 = document.createElement("p");
  paragraph1.textContent = player.id;

  const paragraph2 = document.createElement("p");
  paragraph2.textContent = player.breed;

  const image = document.createElement("img");
  image.src = player.imageUrl;
  image.alt = "Player's name";

  const paragraph3 = document.createElement("p");
  paragraph3.textContent = player.teamId || "Unassigned";

  article.append(heading, paragraph1, paragraph2, image, paragraph3, backToPlayersBtn);
  document.getElementById('player-list').replaceChildren(article);
};


/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */

//Why is the variable name greyed out?
const renderNewPlayerForm = () => {
  try {
    const form = document.createElement("new-player-form")
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('puppyName').value;
      const breed = document.getElementById('breed').value;
      const imageUrl = document.getElementById('img').value;
      const newPlayer = {name, breed, imageUrl}
      console.log(name)
      const addedPlayer = await addNewPlayer(newPlayer);
      renderNewPlayerForm();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
