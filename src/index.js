// Populate all ramens from db into nav bar

// Display a ramen and its details to window when clicked in nav bar

// Create a new ramen to the nav bar when the form is submitted (no persistence)

// Load details for first ramenNav in window on page load

// ! Update the rating and comment for a ramen with the submit form (no persistence)

// ! Persist updates to a ramen's rating and comment

// ! Persist ramen deletions

// ! Variables
const RAMENURL = 'http://localhost:3000/ramens';

const ramenNav = document.querySelector('#ramen-menu');

const ramenWindowImg = document.querySelector('.detail-image');
const ramenWindowName = document.querySelector('.name');
const ramenWindowRest = document.querySelector('.restaurant');

const ratingDisplay = document.querySelector('#rating-display');
const ratingBtnUp = document.querySelector("#rating-button-up");
const ratingBtnDown = document.querySelector("#rating-button-down")
const commentDisplay = document.querySelector('#comment-display');
const commentBtn = document.querySelector("#edit-comment-button");


const submitForm = document.querySelector('#new-ramen');
    const submitBtn = document.querySelector("#new-ramen > input[type=submit]:nth-child(12)")

let currentRamenId;

// ! CRUD functions
const getAllRamens = () => {
    return fetch(RAMENURL)
    .then(resp => resp.json())
    .catch(error => alert('Failed to fetch data.'))
};

const getOneRamen = (requestedRamenId) => {
    return fetch(`${RAMENURL}/${requestedRamenId}`)
    .then(resp => resp.json())
    .catch(error => alert('Failed to fetch data.'))
};

const postNewRamen = (ramenObj) => {
    return fetch(RAMENURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ramenObj)
    })
    .then(resp => resp.json())
    .catch(error => alert('Failed to fetch data.'))
};

// const patchRamenRating = (requestedRamenId) => {
//     return fetch(`${RAMENURL}/${requestedRamenId}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({rating: ratingDisplay})
//     })
//     .then(resp => console.log(resp.json()))

// };

// const patchRamenComment = (requestedRamenId) => {
//     return fetch(`${RAMENURL}/${requestedRamenId}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify()
//     })
// };

const deleteRamen = (ramenId) => {
    return fetch(RAMENURL)
}

// ! Render functions

const renderRamenNav = (ramenObj) => {
    const navImg = document.createElement('img');
    navImg.src = ramenObj.image;
    navImg.alt = ramenObj.name;
    navImg.setAttribute('data-id', ramenObj.id);
    navImg.addEventListener('click', displayToWindowOnClick);
    ramenNav.appendChild(navImg);
};

const renderRamenNavs = (ramensObj) => {
    ramensObj.forEach(ramenElement => renderRamenNav(ramenElement));
};

// ! Display functions
const populateNavBar = () => {
    getAllRamens()
    .then(ramensObj => renderRamenNavs(ramensObj))
};

document.addEventListener('DOMContentLoaded', populateNavBar)

const displayToWindowOnClick = (e) => {
    getOneRamen(e.target.dataset.id)
    .then(ramenObj => {
        ramenWindowImg.src = ramenObj.image;
        ramenWindowImg.alt = ramenObj.name;
        ramenWindowName.textContent = ramenObj.name;
        ramenWindowRest.textContent = ramenObj.restaurant;
        ratingDisplay.textContent = ramenObj.rating;
        commentDisplay.textContent = ramenObj.comment;
    })
};

const displayToWindowOnLoad = (ramenId) => {
    getOneRamen(ramenId)
    .then(ramenObj => {
        ramenWindowImg.src = ramenObj.image;
        ramenWindowImg.alt = ramenObj.name;
        ramenWindowName.textContent = ramenObj.name;
        ramenWindowRest.textContent = ramenObj.restaurant;
        ratingDisplay.textContent = ramenObj.rating;
        commentDisplay.textContent = ramenObj.comment;
    })
}

document.addEventListener('DOMContentLoaded', displayToWindowOnLoad(1))

// ! Submit functions
const submitNewRamen = (e) => {
    const newRamenObj = handleSubmit(e);
    postNewRamen(newRamenObj)
    .then(newRamenObj => ramenNav.appendChild(renderRamenNav(newRamenObj)))
};

const validateFormData = (formInputArr) => {
    return formInputArr.every(element => element.trim() !== '');
};

const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFormData([
        e.target.name.value, 
        e.target.restaurant.value, 
        e.target.image.value, 
        e.target.rating.value, 
        e.target.rating.value, 
        e.target['new-comment'].value])) {
    const newRamenObj = {}
    newRamenObj.name = e.target.name.value;
    newRamenObj.restaurant = e.target.restaurant.value;
    newRamenObj.image = e.target.image.value;
    newRamenObj.rating = e.target.rating.value;
    newRamenObj.comment = e.target['new-comment'].value;
    submitForm.reset();
    return newRamenObj;
    } else {
        alert('Please fill out all fields.')
    }
};

submitForm.addEventListener('submit', submitNewRamen);
