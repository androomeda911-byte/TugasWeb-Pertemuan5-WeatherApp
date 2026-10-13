const API_KEY = "f2e94021f9bd2bd43bfe08bf491f2ee3";

const BASE_URL =
    "https://api.openweathermap.org/data/2.5/weather";


const form = document.querySelector("#searchForm");
const input = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");

const loading = document.querySelector("#loading");

const error = document.querySelector("#error");
const errorMessage = document.querySelector("#errorMessage");

const result = document.querySelector("#weatherResult");

const cityName = document.querySelector("#cityName");
const countryName = document.querySelector("#countryName");

const weatherIcon = document.querySelector("#weatherIcon");

const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");

const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const feelsLike = document.querySelector("#feelsLike");

const historySection =
    document.querySelector("#historySection");

const historyList =
    document.querySelector("#historyList");

const clearHistoryButton =
    document.querySelector("#clearHistory");


const showLoading = () => {
    loading.classList.remove("hidden");

    result.classList.add("hidden");

    error.classList.add("hidden");

    searchButton.disabled = true;

    searchButton.textContent = "Mencari...";
};


const hideLoading = () => {
    loading.classList.add("hidden");

    searchButton.disabled = false;

    searchButton.textContent = "Cari";
};


const showError = (message) => {
    errorMessage.textContent = message;

    error.classList.remove("hidden");

    result.classList.add("hidden");
};


const hideError = () => {
    error.classList.add("hidden");
};


const getWeather = async (city) => {

    try {

        showLoading();

        hideError();

        const url =
            `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;

        const response = await fetch(url);


        if (response.status === 404) {

            throw new Error(
                `Kota "${city}" tidak ditemukan.`
            );

        }


        if (!response.ok) {

            throw new Error(
                "Server sedang bermasalah. Silakan coba lagi."
            );

        }


        const data = await response.json();


        displayWeather(data);


        saveToHistory(city);


    } catch (err) {

        console.error("Error:", err);

        if (err instanceof TypeError) {

            showError(
                "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
            );

        } else {

            showError(err.message);

        }


    } finally {

        hideLoading();

    }

};


const displayWeather = (data) => {


    const {
        name,
        sys,
        main,
        weather,
        wind
    } = data;


    const {
        country
    } = sys;


    const {
        temp,
        humidity: humidityValue,
        feels_like: feelsLikeValue
    } = main;


    const {
        speed
    } = wind;


    const [
        weatherInfo
    ] = weather;


    const {
        description: weatherDescription,
        icon
    } = weatherInfo;


    cityName.textContent = name;

    countryName.textContent =
        `Negara: ${country}`;

    temperature.textContent =
        `${Math.round(temp)}°C`;

    description.textContent =
        weatherDescription;

    humidity.textContent =
        `${humidityValue}%`;

    windSpeed.textContent =
        `${speed} m/s`;

    feelsLike.textContent =
        `${Math.round(feelsLikeValue)}°C`;


    weatherIcon.src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherIcon.alt =
        `Cuaca ${weatherDescription}`;



    result.classList.remove("hidden");

};


const getHistory = () => {

    const savedHistory =
        localStorage.getItem("weatherHistory");

    if (!savedHistory) {
        return [];
    }

    try {

        return JSON.parse(savedHistory);

    } catch (error) {

        console.error(
            "History tidak valid:",
            error
        );

        return [];

    }

};


const saveToHistory = (city) => {

    let history = getHistory();


    const cityLower =
        city.toLowerCase();



    history =
        history.filter(
            item =>
                item.toLowerCase() !== cityLower
        );



    history.unshift(city);



    history =
        history.slice(0, 5);


    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(history)
    );


    displayHistory();

};


const displayHistory = () => {

    const history = getHistory();



    if (history.length === 0) {

        historySection.classList.add("hidden");

        return;

    }


    historySection.classList.remove("hidden");


    const historyHTML =
        history
            .map(
                city => `
                    <button
                        type="button"
                        class="history-item"
                        data-city="${city}"
                    >
                        ${city}
                    </button>
                `
            )
            .join("");


    historyList.innerHTML =
        historyHTML;

};


historyList.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(".history-item");


        if (!button) {
            return;
        }


        const city =
            button.dataset.city;


        input.value = city;

        getWeather(city);

    }
);



clearHistoryButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "weatherHistory"
        );

        displayHistory();

    }
);



form.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const city =
            input.value.trim();



        if (!city) {

            showError(
                "Silakan masukkan nama kota terlebih dahulu."
            );

            return;

        }


        getWeather(city);

    }
);


displayHistory();