import { useNavigate } from "react-router-dom";

const PageState = ({
  title = "Page not found",
  message = "The page you are looking for doesn’t exist or something went wrong.",
  showBack = true,
  showHome = true,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.18),_transparent_35%),linear-gradient(135deg,_#f8f5ff_0%,_#efe7ff_100%)] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-violet-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(91,61,245,0.16)] backdrop-blur">
        <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-semibold text-[#5b3df5]">
          TechRevive
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {showBack && (
            <button
              onClick={handleGoBack}
              className="rounded-2xl bg-[#5b3df5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4c2fe0]"
            >
              Go Back
            </button>
          )}

          {showHome && (
            <button
              onClick={() => navigate("/")}
              className="rounded-2xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-[#5b3df5] transition hover:bg-violet-100"
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageState;
