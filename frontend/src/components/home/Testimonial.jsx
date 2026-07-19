const Testimonial = () => {
  return (
    <section className="bg-[linear-gradient(180deg,_#f8f5ff_0%,_#ffffff_100%)] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-500 font-semibold">Loved by customers</p>
          <h2 className="text-4xl font-bold mt-3">What Our Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-[linear-gradient(135deg,_#ffffff_0%,_#f3ebff_100%)] p-8 rounded-[24px] shadow-sm border border-violet-400">
            ⭐⭐⭐⭐⭐
            <p className="mt-4 text-slate-500">
              Amazing quality refurbished phone. Looks completely new.
            </p>
            <h3 className="font-bold mt-5 text-slate-900">Rahul Sharma</h3>
          </div>

          <div className="bg-[linear-gradient(135deg,_#ffffff_0%,_#f3ebff_100%)] p-8 rounded-[24px] shadow-sm border border-violet-400">
            ⭐⭐⭐⭐⭐
            <p className="mt-4 text-slate-500">
              AI price prediction was very accurate.
            </p>
            <h3 className="font-bold mt-5 text-slate-900">Ayushi Singh</h3>
          </div>

          <div className="bg-[linear-gradient(135deg,_#ffffff_0%,_#f3ebff_100%)] p-8 rounded-[24px] shadow-sm border border-violet-400">
            ⭐⭐⭐⭐⭐
            <p className="mt-4 text-slate-500">
              Delivery was super fast and product quality is excellent.
            </p>
            <h3 className="font-bold mt-5 text-slate-900">Neha Gupta</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;