function adjustDate() {
  let todaysDate = new Date();
  let dateHeading = document.querySelector("#todays-date");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[todaysDate.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Augustus",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[todaysDate.getMonth()];
  let date = todaysDate.getDate();
  dateHeading.innerHTML = `${day}, ${month} ${date}`;
}

function updateTime(response) {
  let todaysDate = new Date(response.data.dt * 1000);
  let timeHours = ("0" + todaysDate.getHours()).slice(-2);
  let timeMinutes = ("0" + todaysDate.getMinutes()).slice(-2);

  document.querySelector(
    "#time-update"
  ).innerHTML = `Last updated - ${timeHours}:${timeMinutes}`;
}

function formatDay(dt) {
  let date = new Date(dt * 1000);
  let weekDay = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[weekDay];
}

function updateWeather(response) {
  updateTime(response);
  adjustDate();
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let iconId = response.data.weather[0].icon;
  let weatherDescription = response.data.weather[0].description;
  let city = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#temperature-today").innerHTML = temperature;
  document.querySelector("#city-heading").innerHTML = city;
  document.querySelector("#weather-description").innerHTML = weatherDescription;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = wind;
  document.getElementById(
    "todays-icon"
  ).src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
  getForecast(response.data.coord);
}

function getWeatherData(city) {
  let apiKey = "3a3fb11a6316d75f69f5016b49163029";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  let weatherData = axios.get(apiUrl).catch((error) => {
    alert("Sorry, we couldn't find that city. Please try again!");
    throw error;
  });
  return weatherData;
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector(".form-control").value.trim();
  getWeatherData(city).then(updateWeather);
}

function updateLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "3a3fb11a6316d75f69f5016b49163029";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(updateWeather);
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(updateLocation);
}

function createForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".weeklyWeatherCard");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    console.log(forecastDay);
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<span class="col">
          <div class="weekDay">${formatDay(forecastDay.dt)}</div>
          <img src=https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png alt="weather icon">
          <div> ${forecastDay.weather[0].main}</div>
          <span class="maxTemp">${Math.round(
            forecastDay.temp.max
          )}°C </span><span class = "minTemp">${Math.round(
          forecastDay.temp.min
        )}°C </span>
          <div><i class="fas fa-tint"></i> ${forecastDay.humidity}%</div>
        </span>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coords) {
  let apiKey = "3a3fb11a6316d75f69f5016b49163029";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(createForecast);
}

let searchForm = document.querySelector("#search-section");
searchForm.addEventListener("submit", handleSubmit);
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getLocation);

getWeatherData("Rotterdam").then(updateWeather);
