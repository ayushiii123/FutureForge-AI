import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">
          Please Login First
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-5">

      <h1 className="text-4xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8">

        <div className="flex items-center gap-8">

          <img
            src={
              user.profileImage ||
              "https://ui-avatars.com/api/?name=" + user.name
            }
            alt=""
            className="w-32 h-32 rounded-full border-4 border-indigo-600"
          />

          <div>

            <h2 className="text-3xl font-bold">
              {user.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {user.email}
            </p>

            <p className="mt-2">
              <strong>Phone :</strong>{" "}
              {user.phone || "Not Added"}
            </p>

            <p className="mt-2">
              <strong>Role :</strong> {user.role}
            </p>

          </div>

        </div>

        <button
          onClick={logout}
          className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Profile;