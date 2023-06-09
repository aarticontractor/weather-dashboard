const apiKey = "20f9a6ae4f100c34e7ae026eafd6150d";
var cityName = document.getElementById("city-name");
const setCity = document.getElementById("current-city");
var searchWeather = document.getElementById("search-weather");
const localeSettings = {};
dayjs.locale(localeSettings);
var all_cities = JSON.parse(localStorage.getItem('top_10_cities')) || [];

var day = [
    document.getElementById("day1"),
    document.getElementById("day2"),
    document.getElementById("day3"),
    document.getElementById("day4"),
    document.getElementById("day5"),
    document.getElementById("day6"),
];

var temps = [
    document.getElementById("temp1"),
    document.getElementById("temp2"),
    document.getElementById("temp3"),
    document.getElementById("temp4"),
    document.getElementById("temp5"),
    document.getElementById("temp6"),
];

var humidity = [
    document.getElementById("humidity1"),
    document.getElementById("humidity2"),
    document.getElementById("humidity3"),
    document.getElementById("humidity4"),
    document.getElementById("humidity5"),
    document.getElementById("humidity6")
];

var wind = [
    document.getElementById("wind1"),
    document.getElementById("wind2"),
    document.getElementById("wind3"),
    document.getElementById("wind4"),
    document.getElementById("wind5"),
    document.getElementById("wind6")
];

var emoji = [
    document.getElementById("emoji1"),
    document.getElementById("emoji2"),
    document.getElementById("emoji3"),
    document.getElementById("emoji4"),
    document.getElementById("emoji5"),
    document.getElementById("emoji6"),
];

function getLatLon(currentCity) {
    var apiUrl =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        currentCity +
        "&limit=5&appid=" +
        apiKey;
    console.log(apiUrl)
    return fetch(apiUrl)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            return {
                lat,
                lon
            }; // return an object with lat and lon values
        })
        .catch(function (error) {
            console.log(error);
        });
}


function getWeather(lat, lon) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
    console.log(weatherUrl);
    return fetch(weatherUrl)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            // console.log(data);
            var city = data.city.name;
            console.log(data);
            setCity.textContent = city;
            saveCity(city);
            generateCitySearch();
            var index = 0;
            for (var i = 0; i < 40; i++) {
                if (i==0) {
                var currentDay = (data.list[i].dt_txt).split(" ")[0];

                var convertedDay = dayjs(currentDay);
                var humanReadableDate = convertedDay.locale('en').format('DD, MMMM, YYYY');

                day[i].textContent = humanReadableDate;
                temps[i].textContent = data.list[i].main.temp;
                humidity[i].textContent = data.list[i].main.humidity;
                wind[i].textContent = data.list[i].wind.speed;

                var weather = data.list[i].weather[0].main;
                if (weather == "Clouds") {
                    emoji[i].textContent = '☁️';
                } else if (weather == "Rain") {
                    emoji[i].textContent = '🌧️';
                } else {
                    emoji[i].textContent = '🌞';
                }
                index++;
            } else {
                var newDay = (data.list[i].dt_txt).split(" ")[0];
                console.log(newDay);
                if (newDay == currentDay) {
                    continue;
                } else {
                    var currentDay = newDay;
                    var convertedDay = dayjs(newDay);
                    var humanReadableDate = convertedDay.locale('en').format('DD, MMMM, YYYY');
                    day[index].textContent = humanReadableDate;
                    temps[index].textContent = data.list[index].main.temp;
                    humidity[index].textContent = data.list[index].main.humidity;
                    wind[index].textContent = data.list[index].wind.speed;

                    var weather = data.list[index].weather[0].main;
                    if (weather == "Clouds") {
                        emoji[index].textContent = '☁️';
                    } else if (weather == "Rain") {
                        emoji[index].textContent = '🌧️';
                    } else {
                        emoji[index].textContent = '🌞';
                    }
                    index++;
                }
            }
        }

        })
        .catch(function (error) {
            console.log(error);
        });
}


function saveCity(cityName) {

    if (all_cities.length > 9) {
        all_cities.shift();
    }

    const index = all_cities.indexOf(cityName);
    console.log("Index is: " + index);
    console.log("ALL cities is: " + all_cities);
    if (index === -1) {
      all_cities.push(cityName);
    } else {
        all_cities.splice(index, 1);
        all_cities.push(cityName);
    }
    localStorage.setItem('top_10_cities', JSON.stringify(all_cities));

}

function generateCitySearch() {
    const container = document.querySelector('.button-container');
    container.innerHTML = '';
    const buttons = [];

    for (let i = 0; i < all_cities.length; i++) {
      const button = document.createElement('button');
      button.textContent = all_cities[i];
      button.id = 'button' + (i + 1);
      button.className = 'btn btn-primary';
      button.addEventListener('click', function() {
        const cityButton = this.textContent;
        setCity.textContent = cityButton;
        console.log(cityButton);
        saveCity(cityButton);
        getLatLon(cityButton).then(function (data) {
        var lat = data.lat;
        var lon = data.lon;
        console.log(lat, lon);

        getWeather(lat, lon);

    });
      });
    buttons.push(button);
    container.appendChild(button);
}}


searchWeather.addEventListener("click", function () {
    event.preventDefault();
    var currentCity = cityName.value;
    
    getLatLon(currentCity).then(function (data) {
        var lat = data.lat;
        var lon = data.lon;
        console.log(lat, lon);

        getWeather(lat, lon);

    });
});

generateCitySearch();
