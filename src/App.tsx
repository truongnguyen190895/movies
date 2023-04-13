import { useState } from "react";
import type { Movie } from "./model/movie";
import mockMovies from "./mock/movies.json";
import moment from "moment";
import { Movies } from "./components/Movies";
import "./App.css";

function App() {
  const [genre, setGenre] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchTime, setSearchTime] = useState<string>("");

  const onChangeGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenre(e.target.value);
  };

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const moviesByGenre = searchByGenre(genre, mockMovies.movies);
    const result = searchByTime(time, moviesByGenre);
    setRecommendedMovies(
      result.sort((a, b) => {
        return b.rating - a.rating;
      })
    );
    setSearchTime(time);
    setErrorMessage(result.length <= 0 ? "no	movie	recommendations" : "");
  };

  const searchByGenre = (inputGenre: string, movies: Movie[]) => {
    const moviesByGenre = movies.filter((movie) =>
      movie.genres.includes(inputGenre)
    );
    return moviesByGenre;
  };

  const searchByTime = (inputTime: string, movies: Movie[]) => {
    const moviesWithoutGMT = movies.map((movie) => {
      const newShowings = movie.showings.map((showing) =>
        showing.slice(0, showing.indexOf("+"))
      );
      return { ...movie, showings: newShowings };
    });

    const d = moment(inputTime, "hh:mm").add(30, "minutes");
    const moviesByTime = moviesWithoutGMT.filter((movie) =>
      movie.showings.find((show) => {
        const showTimeInMoment = moment(show, "hh:mm:ss");
        return showTimeInMoment.isSameOrAfter(d);
      })
    );

    return moviesByTime;
  };

  return (
    <div className="App">
      <div className="input">
        <form>
          <div className="formControl">
            <label htmlFor="genre">Genre:</label>
            <input
              id="genre"
              name="genre"
              type="text"
              value={genre}
              onChange={onChangeGenre}
            />
          </div>
          <div className="formControl">
            <label htmlFor="startTime">Time:</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={time}
              onChange={onChangeTime}
            />
          </div>
          <div>
            <button className="btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="result">
        <h2>Today's recommendation: {errorMessage}</h2>
        {recommendedMovies.length > 0 ? (
          <ul>
            {recommendedMovies.map((movie) => (
              <Movies key={movie.name} inputTime={searchTime} movie={movie} />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default App;
