import { useRef, useState, useEffect } from "react";
import { API_KEY } from "../../apiKey";
import InputBox from "./InputBox.jsx";
import ButtonComponent from "./ButtonComponent.jsx";
import RecentSearches from "./RecentSearches.jsx";
const Api_key = API_KEY;
const App = () => {
  const inputRef = useRef(null);
  const unitRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

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
            },
          ]);
        }
        setShowWeather(data.weather[0].main);
        setApiData(data);
        addToRecentSearches(city);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://cdn.pixabay.com/photo/2015/07/05/10/18/tree-832079_1280.jpg" )',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="h-screen grid place-items-center"
    >
      <div className="bg-white w-96 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <InputBox inputRef={inputRef} unitRef={unitRef} />
          <ButtonComponent onClick={fetchWeather} value={"search"} />
        </div>
        <div
          className={`duration-300 delay-75 overflow-hidden
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
                    <RecentSearches recentSearches={recentSearches} />
                  </>
                )}{" "}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
