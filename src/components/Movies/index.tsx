import type { Movie } from "../../model/movie";
import moment from "moment";

interface Props {
  inputTime: string;
  movie: Movie;
}

export const Movies = ({ movie, inputTime }: Props) => {
  const d = moment(inputTime, "hh:mm").add(30, "minutes");
  const showTimes = movie.showings.filter((show) => {
    const showTimeInMoment = moment(show, "hh:mm:ss");
    return showTimeInMoment.isSameOrAfter(d);
  });
  const timeString = showTimes[0];
  const date = new Date(`2000-01-01T${timeString}`);
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });

  return (
    <>
      <li key={movie.name}>
        {movie.name}, showing at {formattedTime}
      </li>
    </>
  );
};
