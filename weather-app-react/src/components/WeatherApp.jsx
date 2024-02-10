import { useRef, useState } from "react";
import { API_KEY } from "../../apiKey";
import { Line } from "react-chartjs-2";

const Api_key = API_KEY;

const App = () => {
  const inputRef = useRef(null);
  const unitRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [pastWeatherData, setPastWeatherData] = useState([]);

  const [loading, setLoading] = useState(false);
  const addToPastWeatherData = (newData) => {
    console.log(newData);
    setPastWeatherData((prevData) => {
      const newDataPoints = [
        {
          label: `${newData.name}, ${newData.sys.country}`,
          temperature: newData.main.temp,
          weatherType: newData.weather[0].main,
        },
        ...prevData.slice(0, 9),
      ]; // Keep the last 10 data points
      return [...new Set(newDataPoints)];
    });
  };

  const addToRecentSearches = (newCity) => {
    setRecentSearches((prevSearches) => {
      const newSearches = [newCity, ...prevSearches.slice(0, 4)];
      return [...new Set(newSearches)]; // remove duplicates
    });
  };
  const fetchWeather = async () => {
    let city = inputRef.current.value;
    let unit = unitRef.current.value;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${Api_key}`;
    setLoading(true);
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setApiData(null);
        if (data.cod == 404 || data.cod == 400) {
          setShowWeather([
            {
              type: "Not Found",
              img: "https://cdn-icons-png.flaticon.com/512/4275/4275497.png",
            },
          ]);
        }
        setShowWeather(data.weather[0].main);
        console.log(data);
        setApiData(data);
        addToRecentSearches(city);
        addToPastWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="h-screen grid place-items-center">
      <div className="bg-white w-96 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter Your Location"
            className="text-xl border-b
          p-1 border-gray-200 font-semibold uppercase flex-1"
          />
          <select id="unit-switch" ref={unitRef} className="border p-2">
            <option value="metric">Celsius</option>
            <option value="imperial">Fahrenheit</option>
          </select>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={fetchWeather}
          >
            Search
          </button>
        </div>
        <div
          className={`duration-300 delay-75  overflow-hidden
         ${showWeather ? "h-[27rem]" : "h-0"}`}
        >
          {loading ? (
            <div className="grid place-items-center h-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1477/1477009.png"
                alt="..."
                className="w-14 mx-auto mb-2 animate-spin"
              />
            </div>
          ) : (
            showWeather && (
              <div className="text-center flex flex-col gap-6 mt-10">
                {apiData && (
                  <p className="text-xl font-semibold">
                    {apiData?.name + "," + apiData?.sys?.country}
                  </p>
                )}
                <h3 className="text-2xl font-bold text-zinc-800">
                  {showWeather[0]?.type}
                </h3>

                {apiData && (
                  <>
                    <div className="flex justify-center">
                      <div className="block">
                        <h2 className="text-1xl font-extrabold">
                          Temperature: {apiData?.main?.temp}&#176;{" "}
                          {unitRef.current.value === "metric" ? "C" : "F"}
                        </h2>
                        <h5 className="text-1xl font-extrabold">
                          Conditions: {apiData?.weather[0]?.description}
                        </h5>
                        <h5 className="text-1xl font-extrabold">
                          Wind Speed: {apiData?.wind.speed} m/s
                        </h5>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">
                        Recent Searches
                      </h2>
                      <ul>
                        {recentSearches.map((search, index) => (
                          <li key={index} className="cursor-pointer">
                            {search.toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">Chart </h2>
                      <ul>
                        {pastWeatherData.map((data, index) => (
                          <li key={index} className="cursor-pointer">
                            {`${data.label}: ${data.weatherType}, Temperature: ${data.temperature}°`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
