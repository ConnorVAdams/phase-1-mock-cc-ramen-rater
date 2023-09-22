// Populate all ramens from db into nav bar

// Display a ramen and its details to window when clicked in nav bar

// ! Create a new ramen to the nav bar when the form is submitted (no persistence)

// ! Load details for first ramenNav in window on page load

// ! Update the rating and comment for a ramen with the submit form (no persistence)

// ! Persist updates to a ramen's rating and comment

// ! Persist new ramens submitted

// ! Persist ramen deletions

// ! Variables
const RAMENURL = 'http://localhost:3000/ramens';

const ramenNav = document.querySelector('#ramen-menu');

const ramenWindowImg = document.querySelector('.detail-image');
const ramenWindowName = document.querySelector('.name');
const ramenWindowRest = document.querySelector('.restaurant');

const ratingDisplay = document.querySelector('#rating-display');
const commentDisplay = document.querySelector('#comment-display');

const submitForm = document.querySelector('#new-ramen');
    const submitBtn = document.querySelector("#new-ramen > input[type=submit]:nth-child(12)")

let currentRamenId;

// ! CRUD functions
const getAllRamens = () => {
    return fetch(RAMENURL)
    .then(resp => resp.json())
};

const getOneRamen = (requestedRamenId) => {
    return fetch(`${RAMENURL}/${requestedRamenId}`)
    .then(resp => resp.json())
};

const postNewRamen = (ramenObj) => {
    return fetch(RAMENURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ramenObj)
    })
};

// const patchRamenRating = (requestedRamenId) => {
//     return fetch(`${RAMENURL}/${requestedRamenId}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify()
//     })
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

// ! Render functions

const renderRamenNav = (ramenObj) => {
    const navImg = document.createElement('img');
    navImg.src = ramenObj.image;
    navImg.alt = ramenObj.name;
    navImg.setAttribute('data-id', ramenObj.id);
    navImg.addEventListener('click', displayToWindow);
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

//Remember to default to first nav on page load
const displayToWindow = (e) => {
    getOneRamen(e.target.dataset.id)
    .then(ramenObj => {
        ramenWindowImg.src = ramenObj.image;
        ramenWindowImg.alt = ramenObj.name;
        ramenWindowName.textContent = ramenObj.name;
        ramenWindowRest.textContent = ramenObj.restaurant;
    })
};

// ! Submit functions
const submitNewRamen = (e) => {
    handleSubmit(e)
};

const handleSubmit = (e) => {
    e.preventDefault();

    const newRamenObj = {}
    newRamenObj.name = e.target.name.value;
    newRamenObj.restaurant = e.target.restaurant.value;
    newRamenObj.image = e.target.image.value;
    newRamenObj.rating = e.target.rating.value;
    newRamenObj.comment = e.target['new-comment'].value;
};

submitForm.addEventListener('submit', handleSubmit);
