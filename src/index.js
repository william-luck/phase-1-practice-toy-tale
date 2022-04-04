let addToy = false;
renderToys();

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function renderToys() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(json => addToysToPage(json));
}

function addToysToPage(infoArray) {
  const toyContainer = document.getElementById('toy-collection');
  // console.log(infoArray)

  for (const element of infoArray) {
    const card = document.createElement('div')
    card.className = 'card';
    toyContainer.append(card)
    
    const header = document.createElement('h2')
    header.textContent = element.name
    card.append(header)

    const img = document.createElement('img')
    img.src = element.image
    img.className = "toy-avatar"
    card.append(img)

    const p = document.createElement('p')
    p.textContent = `Likes: ${element.likes}`
    card.append(p)

    const btn = document.createElement('button')
    btn.textContent = "Like ❤️";
    btn.className = "like-btn"
    btn.id = element.id
    card.append(btn)

  }

  const likeButtons = document.querySelectorAll('.like-btn')
  console.log(likeButtons)
  addLikeButtonFunctionality(likeButtons)
}
// could pass array with just the added element to this

const form = document.querySelector('form')
form.addEventListener('submit', e => {
  e.preventDefault()
  const newName = e.target.toy_name.value
  const newURL = e.target.img_url.value
  addNewToy(newName, newURL)
})

function addNewToy(name, URL) {
  const configurationObject = {
    method: "POST", 
    headers:
    {
      "Content-Type": "application/json",
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "name": name,
      "image": URL,
      "likes": 0
    })
  }

  fetch('http://localhost:3000/toys', configurationObject)
    .then(addLatestToy()) // Need to just add the newly submitted element. 
}

function addLatestToy() {
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(arrToys => {
    console.log(arrToys);
    let lastElement = arrToys.length-1
    const newToyObj = arrToys[lastElement]
    addSingleToyToPage(newToyObj);
  }
  )
}

function addSingleToyToPage(newToyObj) {
  console.log(newToyObj)

  const toyContainer = document.getElementById('toy-collection');

  const card = document.createElement('div')
  card.className = 'card';
  toyContainer.append(card)
  
  const header = document.createElement('h2')
  header.textContent = newToyObj.name
  card.append(header)

  const img = document.createElement('img')
  img.src = newToyObj.image
  img.className = "toy-avatar"
  card.append(img)

  const p = document.createElement('p')
  p.textContent = `Likes: ${newToyObj.likes}`
  card.append(p)

  const btn = document.createElement('button')
  btn.textContent = "Like ❤️";
  btn.className = "like-btn"
  btn.id = newToyObj.id
  card.append(btn)

  const likeButtons = document.querySelectorAll('.like-btn')
  addLikeButtonFunctionality(likeButtons)
}

function addLikeButtonFunctionality(likeButtons){
  likeButtons.forEach(element => element.addEventListener('click', e => {
    let likes = parseInt(e.target.parentNode.childNodes[2].textContent[7],10) // access the id of the button clicked
    likes++;
    const id = parseInt(e.target.id, 10) // access the current amount of likes for that button 
    console.log(likes)
    let likeString = e.target.parentNode.childNodes[2]
    updateLikes(id, likes, likeString)
  }))
}

function updateLikes(toy, likes, likeString) {
  fetch(`http://localhost:3000/toys/${toy}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'likes': likes
    })
  })
  .then(response => response.json())
  .then(toy=> {
    console.log(toy.likes)
    likeString.textContent = `Likes: ${toy.likes}`
  })

  
}




