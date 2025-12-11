import { Boxes, Computer, User } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router";

type CardType = "user" | "computer" | "group";

interface CardProps {
  color: string;
  bg: string;
  icon: JSX.Element;
}

const CardConfig: Record<CardType, CardProps> = {
  user: {
    color: "border-green-600 text-green-600",
    bg: "bg-green-50",
    icon: <User size={48} />,
  },
  computer: {
    color: "border-yellow-500 text-yellow-500",
    bg: "bg-yellow-50",
    icon: <Computer size={48} />,
  },
  group: {
    color: "border-blue-600 text-blue-600",
    bg: "bg-blue-100",
    icon: <Boxes size={48} />,
  },
};

const StatisticCard = ({
  title,
  count,
  type,
}: {
  title: string;
  count: number;
  type: CardType;
}) => {
  const config = CardConfig[type];
  return (
    <div
      className={`p-10 border rounded-xl text-3xl shadow-md ${config.color}`}
    >
      <Link
        to={`${type}s`}
        className="flex justify-start align-middle text-start grow gap-6"
      >
        <div className={`${config.bg} rounded-xl p-4`}>{config.icon}</div>
        <div className="flex flex-col items-start justify-center text-left">
          <p className="font-bold text-4xl">{count}</p>
          <p>{title}</p>
        </div>
      </Link>
    </div>
  );
};

export default StatisticCard;
