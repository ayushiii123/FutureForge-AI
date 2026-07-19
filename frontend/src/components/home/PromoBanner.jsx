const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,_#5b3df5_0%,_#7c3aed_100%)] text-white p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between shadow-[0_24px_70px_rgba(91,61,245,0.24)]">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-100 font-semibold">Smart exchange</p>
          <h2 className="text-4xl lg:text-5xl font-bold mt-3">
            Exchange Your
            <br />
            Old Gadget
          </h2>

          <p className="mt-5 text-lg text-violet-50">
            Upgrade to the latest technology and get the best exchange value powered by AI.
          </p>

          <a href="/exchange" className="mt-8 inline-block bg-white text-[#5B3DF5] px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition">
            Exchange Now
          </a>
        </div>

        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700"
          alt=""
          className="w-[360px] rounded-[28px] mt-10 lg:mt-0 border border-white/20 shadow-2xl"
        />
      </div>
    </section>
  );
};

export default PromoBanner;