import { redirect } from "next/navigation";
import { verifyUser } from "../_lib/actions";
import { IUser } from "../_lib/types";

export default async function Profile() {
  const user = await verifyUser();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-gray-800 to-black text-white py-10 px-6 rounded-xl shadow-2xl">
      <div className="relative">
        <img
        src="https://wallpapers.com/images/hd/funny-facebook-profile-pictures-1200-x-1200-nghrweqjmsbdt69s.jpg"
          alt="Profile Picture"
          className="w-36 h-36 rounded-full border-4 border-purple-600 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
      <h1 className="mt-5 text-3xl font-extrabold text-purple-400">
        {user.name}
      </h1>
      <p className="mt-3 text-lg text-gray-300 font-medium">{user.surname}</p>
    </div>
  );
}

