import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";

interface UserInfo {
  name: string;
  email: string;
  avatar: string | null;
}

const UserCard = ({ name, email, avatar }: UserInfo) => {
  const regex = /\b\w/g;
  const initials = name.match(regex);
  const initReduced = initials?.slice(0, 2);
  const avatarFallback = initReduced?.join("");

  return (
    <div className="flex gap-3 max-w-80 justify-end">
      <Avatar className="shrink-0">
        <AvatarImage src={avatar as string} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full items-start justify-center min-[360px]:max-[800px]:hidden">
        <p className="text-sm text-slate-900 font-semibold">{name}</p>
        <p className="text-xs text-slate-600 font-normal">{email}</p>
      </div>
    </div>
  );
};

export default UserCard;
