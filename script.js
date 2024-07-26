const API_KEY = 'live_aWj4pupM7MlUOI4XbX2PEqFvIU1uXyQJ1XHCqiKpppQZ0OgCWrrpSUV6xyUDf8Fw';
const API_URL = 'https://api.thecatapi.com/v1/breeds';

const descriptionTranslations = {
    "Abyssinian": "Kucing Abyssinian adalah ras kucing yang sangat aktif dan energik. Mereka dikenal dengan bulu pendek yang halus dan tubuh ramping yang elegan. Kucing ini sangat suka bermain dan menjelajah.",
    "Bengal": "Kucing Bengal dikenal dengan pola bulu yang menyerupai macan tutul dan memiliki kepribadian yang sangat energik. Mereka adalah ras kucing yang cerdas, aktif, dan suka berlari.",
    "Birman": "Kucing Birman adalah ras kucing yang lembut dan tenang, dengan bulu panjang yang lembut serta mata biru yang cerah. Mereka dikenal karena sifatnya yang ramah dan penyayang.",
    "Bombay": "Kucing Bombay memiliki bulu hitam mengkilap dan mata emas yang menawan. Mereka adalah kucing yang ramah, sosial, dan sangat suka perhatian dari pemiliknya.",
    "British Shorthair": "Kucing British Shorthair adalah ras kucing yang kuat dengan bulu pendek yang padat. Mereka dikenal dengan sifatnya yang tenang, cerdas, dan mudah beradaptasi dengan lingkungan baru.",
    "Maine Coon": "Kucing Maine Coon adalah salah satu ras kucing terbesar dengan bulu panjang dan lebat. Mereka sangat ramah, cerdas, dan dikenal karena sifatnya yang baik hati serta kemampuannya beradaptasi dengan berbagai situasi.",
    "Persian": "Kucing Persia memiliki bulu panjang yang indah dan wajah datar. Mereka adalah kucing yang tenang dan suka berada di lingkungan yang tenang serta membutuhkan perawatan bulu secara rutin.",
    "Siamese": "Kucing Siamese dikenal dengan bulu pendek dan mata biru yang mencolok. Mereka adalah ras kucing yang vokal, sosial, aktif, dan sangat membutuhkan interaksi dengan pemiliknya.",
    "Sphynx": "Kucing Sphynx adalah ras kucing tanpa bulu dengan kulit keriput yang unik. Mereka dikenal sangat ramah, suka perhatian, dan membutuhkan perhatian khusus dalam hal perawatan kulit."
};

const defaultCatImages = {
    "Abyssinian": "https://example.com/images/abyssinian.jpg",
    "Bengal": "https://example.com/images/bengal.jpg",
    "Birman": "https://example.com/images/birman.jpg",
    "Bombay": "https://example.com/images/bombay.jpg",
    "British Shorthair": "https://example.com/images/british_shorthair.jpg",
    "Maine Coon": "https://example.com/images/maine_coon.jpg",
    "Persian": "https://example.com/images/persian.jpg",
    "Siamese": "https://example.com/images/siamese.jpg",
    "Sphynx": "https://example.com/images/sphynx.jpg",
};

let allBreeds = [];
let modal = document.getElementById('modal');

async function fetchCatBreeds() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'x-api-key': API_KEY
            }
        });
        if (!response.ok) throw new Error('Tanggapan jaringan tidak sesuai');
        allBreeds = await response.json();
        displayCatBreeds(allBreeds);
        populateDropdown(allBreeds);
    } catch (error) {
        console.error('Error fetching cat breeds:', error);
        document.getElementById('cat-container').innerHTML = '<p>Terjadi kesalahan saat mengambil data kucing. Coba lagi nanti.</p>';
    }
}

function displayCatBreeds(breeds) {
    const container = document.getElementById('cat-container');
    container.innerHTML = '';
    if (breeds.length === 0) {
        container.innerHTML = '<p>Tidak ada data kucing untuk ditampilkan.</p>';
        return;
    }
    breeds.forEach(breed => {
        const catCard = document.createElement('div');
        catCard.className = 'cat-card';
        const imgUrl = breed.image && breed.image.url ? breed.image.url : defaultCatImages[breed.name] || 'https://example.com/images/default.jpg';
        catCard.innerHTML = `
            <h2>${breed.name}</h2>
            <img src="${imgUrl}" alt="${breed.name}" data-breed='${JSON.stringify(breed)}'>
        `;
        container.appendChild(catCard);
    });

    const images = document.querySelectorAll('.cat-card img');
    images.forEach(img => img.addEventListener('click', showModal));
}

function populateDropdown(breeds) {
    const dropdown = document.getElementById('search-dropdown');
    dropdown.innerHTML = '<option value="">Pilih jenis kucing...</option>';
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.name;
        option.textContent = breed.name;
        dropdown.appendChild(option);
    });
    dropdown.style.display = 'block';
}

function searchBreeds(event) {
    const query = event.target.value.toLowerCase();
    const filteredBreeds = allBreeds.filter(breed => breed.name.toLowerCase().includes(query));
    displayCatBreeds(filteredBreeds);
    populateDropdown(filteredBreeds);
}

function searchDropdown(event) {
    const selectedBreed = event.target.value;
    if (selectedBreed === "") {
        displayCatBreeds(allBreeds);
        return;
    }
    const filteredBreeds = allBreeds.filter(breed => breed.name === selectedBreed);
    displayCatBreeds(filteredBreeds);
}

function showModal(event) {
    const breed = JSON.parse(event.target.getAttribute('data-breed'));
    document.getElementById('modal-name').innerText = breed.name;
    document.getElementById('modal-image').src = breed.image && breed.image.url ? breed.image.url : defaultCatImages[breed.name] || 'https://example.com/images/default.jpg';
    document.getElementById('modal-description').innerText = descriptionTranslations[breed.name] || breed.description;
    document.getElementById('modal-temperament').innerText = breed.temperament;
    document.getElementById('modal-origin').innerText = breed.origin;

    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

fetchCatBreeds();

document.getElementById('search-input').addEventListener('input', searchBreeds);

document.getElementById('search-dropdown').addEventListener('change', searchDropdown);

document.getElementById('modal-close').addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});
