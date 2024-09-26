import { FC } from "react";
// hooks
import { useCurrentTime } from "@/hooks/use-current-time";

// types
import { User } from "@prisma/client";


export interface IUserGreetingsView {
  user: User;
}

export const UserGreetingsView: FC<IUserGreetingsView> = (props) => {
  const { user } = props;
  // current time hook
  const { currentTime } = useCurrentTime();

  const hour = new Intl.DateTimeFormat("pt-BR", {
    hour12: false,
    hour: "numeric",
  }).format(currentTime);

  const date = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    day: "numeric",
  }).format(currentTime);

  const weekDay = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(currentTime);

  const timeString = new Intl.DateTimeFormat("pt-BR", {
    timeZone: 'America/Sao_Paulo',
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentTime);

  const greeting = parseInt(hour, 10) < 12 ? "Bom dia" : parseInt(hour, 10) < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div>
      <h3 className="text-xl font-semibold">
        {greeting}, {user?.name}
      </h3>
      <h6 className="flex items-center gap-2 font-medium text-custom-text-400">
        <div>{greeting === "Bom dia" ? "🌤️" : greeting === "Boa tarde" ? "🌥️" : "🌙️"}</div>
        <div>
          {weekDay}, {date} {timeString}
        </div>
      </h6>
    </div>
  );
};
