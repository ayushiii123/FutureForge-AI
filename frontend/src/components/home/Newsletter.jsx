const Newsletter = () => {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto bg-[linear-gradient(135deg,_#5b3df5_0%,_#7c3aed_100%)] rounded-[32px] p-10 lg:p-12 text-center text-white shadow-[0_24px_70px_rgba(91,61,245,0.24)]">
        <h2 className="text-4xl font-bold">Stay Updated</h2>
        <p className="mt-5 text-violet-50 max-w-2xl mx-auto">
          Subscribe for latest gadgets, AI offers, and exclusive discounts delivered straight to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row mt-8 max-w-xl mx-auto gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-2xl px-5 py-4 text-slate-800 outline-none"
          />
          <button className="bg-slate-950 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-800 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;