import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();//using fileReader to read and to convert base64 string
    reader.readAsDataURL(file);//read image as base64 string, as image it can be stored as text

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);//update the ui
      await updateProfile({ profilePic: base64Image });//from zustand to update in database
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 pt-20">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Profile</h1>
          <p className="text-gray-500">Your profile information</p>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          {/* ProfilePic */}
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="size-28 sm:size-32 md:size-36 rounded-full object-cover border-4 border-primary"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-primary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"//only accept image files
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <p className="text-sm text-gray-500 text-center px-2">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-4 mt-6">
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-gray-100 rounded-lg border">
              {authUser?.fullName}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-gray-100 rounded-lg border">
              {authUser?.email}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-gray-100 rounded-xl p-4">
          <h2 className="text-lg font-medium text-primary mb-4">
            Account Information
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-300">
              <span>Member Since</span>
              <span>
                {new Date(authUser.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
