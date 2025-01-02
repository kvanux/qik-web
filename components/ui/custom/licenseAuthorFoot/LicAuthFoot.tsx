import React from "react";
import Image from "next/image";

const LicAuthFoot = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <p className="text-sm font-medium text-slate-500">© 2024 QIK Finance</p>
      <Image
        src={"/svg/logoMarkup.svg"}
        width={115}
        height={20}
        alt="logOliver"
        priority
      />
    </div>
  );
};

export default LicAuthFoot;
