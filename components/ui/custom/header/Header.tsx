import Image from "next/image";
import UserCard from "../userCard/UserCard";

const Header = () => {
  const user = {
    name: "Oliver",
    avatar: "",
  };
  return (
    <div
      id="header"
      className="w-full flex justify-between mb-6 px-5 py-4 bg-white rounded-xl items-center shadow-qele-panel"
    >
      <Image
        src="/image/logo-lg.png"
        alt="logo"
        width={40}
        height={40}
        className="w-10 h-10"
      />
      <div id="rightBtnsGroup">
        <UserCard />
        {/* <DateTime className="text-base text-gray-600 shrink-0" /> */}
      </div>
    </div>
  );
};

export default Header;
