const API_KEY = "18e0da2ab12f8975f3864ca625f9d05a";

const loader = document.getElementById("loader");

// 🌍 Get Weather by City
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;

  if (!city) return alert("Enter city name");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  fetchWeather(url);
  fetchForecast(city);
}

// 📍 Location Weather
function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetchWeather(url);

    fetchForecastByCoords(lat, lon);
  });
}

// 🔄 Fetch Weather
async function fetchWeather(url) {
  loader.style.display = "block";

  const res = await fetch(url);
  const data = await res.json();

  loader.style.display = "none";

  displayWeather(data);
}

// 🌦 Display Weather
function displayWeather(data) {
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temperature").innerText = `${data.main.temp}°C`;
  document.getElementById("condition").innerText = data.weather[0].main;
  document.getElementById("humidity").innerText = data.main.humidity;
  document.getElementById("wind").innerText = data.wind.speed;

  // Icon
  const icon = data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  changeBackground(data.weather[0].main);
}

// 🎨 Dynamic Background
function changeBackground(condition) {
  const body = document.body;

  if (condition.includes("Cloud")) {
    body.style.background = "#dfe6e9";
  } else if (condition.includes("Rain")) {
    body.style.background = "#74b9ff";
  } else if (condition.includes("Clear")) {
    body.style.background = "#ffeaa7";
  } else {
    body.style.background = "#ffffff";
  }
}

// 🌙 Toggle Theme
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// 📅 Forecast by City
async function fetchForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  showForecast(data);
}

// 📅 Forecast by Location
async function fetchForecastByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  showForecast(data);
}

// 📊 Display Forecast
function showForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach(day => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${new Date(day.dt_txt).toDateString().slice(0,3)}</p>
      <p>${day.main.temp}°C</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"/>
    `;

    forecastDiv.appendChild(div);
  });
}