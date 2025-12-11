import { Link } from "react-router";

const Header = () => {
  return (
    <div className="border-b rounded-xl py-10 flex justify-center align-middle gap-10 text-3xl">
      <Link to={"/"}>Dashboard</Link>
      <Link to={"/users"} className="text-green-600">
        Kullanıcılar
      </Link>
      <Link to={"/computers"} className="text-yellow-500">
        Bilgisayarlar
      </Link>
      <Link to={"/groups"} className="text-blue-600">
        Gruplar
      </Link>
    </div>
  );
};

export default Header;
