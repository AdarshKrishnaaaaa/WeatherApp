const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");
const heading = document.querySelector(".weather-heading");
const title = document.querySelector("title");
const input = document.querySelector(".search-box input");
const suggestionBox = document.querySelector(".suggestions");

weatherBox.style.display = "none";
weatherDetails.style.display = "none";

input.addEventListener("input", async () => {
  const query = input.value;

  if (query.length < 2) {
    suggestionBox.innerHTML = "";
    return;
  }

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`,
  );

  const data = await res.json();

  suggestionBox.innerHTML = "";

  if (!data.results) return;

  data.results.forEach((place) => {
    const li = document.createElement("li");
    li.textContent = `${place.name}, ${place.admin1}, ${place.country}`;

    li.addEventListener("click", () => {
      input.value = place.name;
      suggestionBox.innerHTML = "";
      search.click();
    });

    suggestionBox.appendChild(li);
  });
});

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    search.click();
  }
});

search.addEventListener("click", () => {
  const APIKey = "485099f9d90e41bda87174132261605";
  const city = document.querySelector(".search-box input").value;

  if (city === "") return;

  fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${city}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);

      if (json?.error?.code) {
        container.style.height = "400px";
        heading.style.display = "none";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      }
      error404.style.display = "none";
      error404.classList.remove("fadeIn");

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span",
      );
      const wind = document.querySelector(".weather-details .wind span");

      image.src = json.current.condition.icon;

      temperature.innerHTML = `${parseInt(json.current.temp_c)}<span>°C</span>`;
      description.innerHTML = `${json.current.condition.text}`;
      humidity.innerHTML = `${json.current.humidity}%`;
      wind.innerHTML = `${parseFloat(json.current.wind_kph).toFixed(1)} km/h`;
      title.innerHTML = `${json.location.name} weather`;

      weatherBox.style.display = "";
      weatherDetails.style.display = "";
      weatherBox.classList.add("show");
      weatherDetails.classList.add("show");
      container.style.height = "590px";
      heading.style.display = "none";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
});
