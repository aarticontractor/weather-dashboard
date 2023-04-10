const apiKey = "20f9a6ae4f100c34e7ae026eafd6150d";
var cityName = document.getElementById("city-name");
var searchWeather = document.getElementById("search-weather");

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
        "http://api.openweathermap.org/geo/1.0/direct?q=" +
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
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
    console.log(weatherUrl);
    return fetch(weatherUrl)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            // console.log(data);
            var city = data.city.name;
            console.log(data);
            for (var i = 0; i < 6; i++) {
                day[i].textContent = data.list[i].dt_txt;
                temps[i].textContent = data.list[i].main.temp;
                humidity[i].textContent = data.list[i].main.humidity;
                wind[i].textContent = data.list[i].wind.speed;

                var weather = data.list[i].weather[0].main;
                if (weather == "Clouds") {
                    emoji[i].textContent = '☁️';
                } else if (weather == "Rain") {
                    emoji[i].textContent = '⛈️';
                } else {
                    emoji[i].textContent = '☀️';
                }
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}


searchWeather.addEventListener("click", function () {
    event.preventDefault();
    var currentCity = cityName.value;
    console.log(currentCity);
    getLatLon(currentCity).then(function (data) {
        var lat = data.lat;
        var lon = data.lon;
        console.log(lat, lon);

        getWeather(lat, lon);

    });


});