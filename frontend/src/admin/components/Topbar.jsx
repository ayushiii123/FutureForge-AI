const Topbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h2 className="text-2xl font-bold">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <img
          src="https://i.pravatar.cc/40"
          alt="Admin"
          className="rounded-full"
        />

        <span className="font-semibold">
          Admin
        </span>

      </div>

    </div>
  );
};

export default Topbar;