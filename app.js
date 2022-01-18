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
    "Agustus",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[todaysDate.getMonth()];
  let date = todaysDate.getDate();
  let year = todaysDate.getFullYear();
  dateHeading.innerHTML = `${day}, ${month} ${date}, ${year}`;
}

function updateTime() {
  let todaysDate = new Date();
  let timeHours = ("0" + todaysDate.getHours()).slice(-2);
  let timeMinutes = ("0" + todaysDate.getMinutes()).slice(-2);

  document.querySelector(
    "#time-update"
  ).innerHTML = `Last updated - ${timeHours}:${timeMinutes}`;
}

function updateTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#temperature-today").innerHTML = temperature;
}

function updateWeather(response) {
  resetToCelsius();
  updateTime();
  adjustDate();
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let iconId = response.data.weather[0].icon;
  let weatherDescription = response.data.weather[0].main;
  let city = response.data.name;
  updateTemperature(response);
  document.querySelector("#city-heading").innerHTML = city;
  document.querySelector("#weather-description").innerHTML = weatherDescription;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = wind;
  document.getElementById(
    "todays-icon"
  ).src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
}

function getWeatherData(city, units) {
  let apiKey = "3a3fb11a6316d75f69f5016b49163029";
  if (units === undefined) {
    units = "metric";
  }
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

function resetToCelsius() {
  isMetric = true;
  let rightUnit = document.querySelector("#right-unit");
  rightUnit.innerHTML = "°F";
  let leftUnit = document.querySelector("#left-unit");
  leftUnit.innerHTML = "°C";
}
function changeToCelsius() {
  resetToCelsius();
  let temperatureHeading = document.querySelector("#temperature-today");
  let temperature = temperatureHeading.textContent;
  temperatureHeading.innerHTML = Math.round((temperature - 32) * 0.5556);
}
function changeToFahrenheit() {
  isMetric = false;
  let rightUnit = document.querySelector("#right-unit");
  rightUnit.innerHTML = "°C";
  let leftUnit = document.querySelector("#left-unit");
  leftUnit.innerHTML = "°F";
  let temperatureHeading = document.querySelector("#temperature-today");
  let temperature = temperatureHeading.textContent;
  temperatureHeading.innerHTML = Math.round(temperature * 1.8 + 32);
}

getWeatherData("Rotterdam").then(updateWeather);
let isMetric = true;

let searchForm = document.querySelector("#search-section");
searchForm.addEventListener("submit", handleSubmit);
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getLocation);

let unitsButton = document.querySelector("#right-unit");
unitsButton.addEventListener("click", function () {
  if (isMetric) {
    changeToFahrenheit();
  } else {
    changeToCelsius();
  }
});
