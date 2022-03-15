const form = document.querySelector('.top-banner form');
const input = document.querySelector('.container input');
const msg = document.querySelector('span.msg');
const list = document.querySelector('.ajax-section .cities');


localStorage.setItem('apiKey', EncryptStringAES("86d30bb57c3b71dd5211a01a1d9d07a5"));

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    getWeatherDataFromApi();
});

const getWeatherDataFromApi = async() => {
    let apiKey = DecryptStringAES(localStorage.getItem('apiKey'));
    let inputVal = input.value;
    let units = 'metric';
    let lang = 'en';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
        const response = await axios(url);
        const {main, name, sys, weather} = response.data;
        const iconUrl = `https://openweathermap.org/img/wn/${
            weather[0].icon}@2x.png`;

        let cityList = list.querySelectorAll('.city');
        let cityListArray = Array.from(cityList);
        if(cityListArray.length > 0){
            const filteredArray = cityListArray.filter(card => card.querySelector('.cty-name span').innerText == name);
    
            if(filteredArray.length > 0){
                msg.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
                form.reset();
                input.focus();
                return;
            }
        }

        let createdCityCardLi = document.createElement('li');
        createdCityCardLi.classList.add('city');
        list.prepend(createdCityCardLi);
        createdCityCardLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`
        form.reset();
        input.focus();



    } catch (error) {
        msg.innerText = error;
        setTimeout(() => {
            msg.innerText = '';
        }, 5000)
        form.reset();
        input.focus();
    }
};
