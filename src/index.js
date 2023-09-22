// ! Variables
const RAMENURL = 'http://localhost:3000/ramens';

const ramenNav = document.querySelector('#ramen-menu');

const ramenWindowImg = document.querySelector('.detail-image');
const ramenWindowName = document.querySelector('.name');
const ramenWindowRest = document.querySelector('.restaurant');

const ratingDisplay = document.querySelector('#rating-display');
const commentDisplay = document.querySelector('#comment-display');

const deleteBtn =  document.querySelector("#delete-button");

const submitForm = document.querySelector('#new-ramen');

const editForm = document.querySelector('#edit-ramen');

let currentlyDisplayedRamen;

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

const patchRamen = (e) => {
    const patchData = handleUpdate(e)
    return fetch(`${RAMENURL}/${currentlyDisplayedRamen}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
    })
    .then(resp => console.log(resp.json()))
    .then(ramenObj => displayToWindow(currentlyDisplayedRamen))
    .catch(error => alert('Failed to submit data.'))
};

const handleUpdate = (e) => {
    e.preventDefault();
    const updatedRamenObj = {};
    if (validateFormData([e.target.rating.value, e.target['new-comment'].value])) {
        updatedRamenObj.rating = parseInt(e.target.rating.value);
        updatedRamenObj.comment = e.target['new-comment'].value;
        editForm.reset();
        return updatedRamenObj;
    } else if (validateFormData([e.target.rating.value])) {
        updatedRamenObj.rating = parseInt(e.target.rating.value);
        editForm.reset();
        return updatedRamenObj;
    } else {
        updatedRamenObj.comment = e.target['new-comment'].value;
        editForm.reset();
        return updatedRamenObj;
    }
};

editForm.addEventListener('submit', patchRamen)

const deleteRamen = () => {
    return fetch(`${RAMENURL}/${currentlyDisplayedRamen}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(removeFromDom())
    .then(displayToWindow(parseInt(currentlyDisplayedRamen + 1))) //TODO Spread into an array so next can be displayed
    .catch(error => alert('Failed to delete data.'))
};

const removeFromDom = () => {
    document.querySelector(`[data-id='${currentlyDisplayedRamen}`).remove();
}

deleteBtn.addEventListener('click', deleteRamen)

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
        currentlyDisplayedRamen = ramenObj.id;
    })
};

const displayToWindow = (ramenId) => {
    getOneRamen(ramenId)
    .then(ramenObj => {
        ramenWindowImg.src = ramenObj.image;
        ramenWindowImg.alt = ramenObj.name;
        ramenWindowName.textContent = ramenObj.name;
        ramenWindowRest.textContent = ramenObj.restaurant;
        ratingDisplay.textContent = ramenObj.rating;
        commentDisplay.textContent = ramenObj.comment;
        currentlyDisplayedRamen = ramenObj.id;
    })
};

document.addEventListener('DOMContentLoaded', displayToWindow(1))

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
