const accessKey = 'AWBrstkMO9rbbO4gdcZ1rlTQ2XqcxAatQngyq6wHdBk';
const secretKey = 'Tq3-USu6b3xUzKIVOmA4KhvetClTCZcCFvayPVR7sPU';
const baseUrl = 'https://api.unsplash.com/';
const baseUrlOauth = 'https://unsplash.com/oauth/'
const code = new URLSearchParams(window.location.search).get('code');
let accessToken;

function handleAccessToken(response) {
    accessToken = response ['access_token'];
    console.log(accessToken);
}

async function handleLikeClick(event) {
    const imageContainer = event.currentTarget.parentNode;
    const imageElem = imageContainer.querySelector('img');
    const imageId = imageElem.dataset.id;
    await fetch(`${baseUrl}photos/${imageId}/like`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }).then(response => response.json());

    imageContainer.querySelector('a').text = 'Unlike';
}

async function handleSearch(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const searchBox = formElement.querySelector('input[type=search]');
    const response = await fetch(`${baseUrl}search/photos?query=${encodeURIComponent(searchBox.value)}&client_id=${accessKey}`).then(response => response.json());
    console.log(searchBox.value);

    const photoWrapper = formElement.parentNode.querySelector('.results');
    photoWrapper.innerHTML = '';

    for (const [i, elem] of response.results.entries()) {
        if (i > 3) break;
        const photoContainer = document.createElement('div');
        photoContainer.style.display = 'flex';
        photoContainer.style.flexDirection = 'column';
        photoContainer.style.textAlign = 'left';

        const photo = document.createElement('img');
        photo.src = elem.urls.full;
        photo.dataset.id = elem.id;
        photo.classList.add('elegant-image')
        const likeText = document.createElement('a')
        likeText.classList.add('links');
        likeText.classList.add('buttons');
        likeText.text = 'Like';
        likeText.style.maxWidth = '85%';
        likeText.addEventListener('click', handleLikeClick);
        photoContainer.appendChild(photo)
        photoContainer.appendChild(likeText);
        photoWrapper.appendChild(photoContainer);
    }
}

if (code !== null) {
    fetch(`https://unsplash.com/oauth/token?client_id=${accessKey}&client_secret=${secretKey}&redirect_uri=https://photo-exhibition.000webhostapp.com&code=${code}&grant_type=authorization_code`, {
        method: 'POST',
    }).then(response => response.json()).then(handleAccessToken);
}


for (const form of document.getElementsByClassName('ricerca')) {
    form.addEventListener('submit', handleSearch);
}


