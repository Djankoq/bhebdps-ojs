const itemContainer = document.getElementById('items');
const loader = document.getElementById('loader');

function renderCourses(valutes) {
    itemContainer.innerHTML = '';

    for (let key in valutes) {
        const valute = valutes[key];

        const itemHtml = `
            <div class="item">
                <div class="item__code">${valute.CharCode}</div>
                <div class="item__value">${valute.Value}</div>
                <div class="item__currency">руб.</div>
            </div>
        `;

        itemContainer.insertAdjacentHTML('beforeend', itemHtml);
    }
}

const cachedData = localStorage.getItem('currencyData');
if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    renderCourses(parsedData);

    loader.classList.remove('loader_active')
}

fetch('https://students.netoservices.ru/nestjs-backend/slow-get-courses')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network Error');
        }
        return response.json();
    })
    .then(data => {
        const valutes = data.response.Valute;

        localStorage.setItem('currencyData', JSON.stringify(valutes));

        renderCourses(valutes);

        loader.classList.remove('loader_active');
    })
    .catch(error => {
        console.error('Error to get data: ', error);

        if (!cachedData) {
            itemContainer.innerText = 'Не удалось загрузить данные.';
        }
        loader.classList.remove('loader_active')
    })