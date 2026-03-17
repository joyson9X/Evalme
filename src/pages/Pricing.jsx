import React from 'react';

const Pricing = ({ PLANS, handlePayment, navigateTo, couponCode, setCouponCode, couponError, setCouponError, handleCoupon }) => {
  return (
    <div className="w-full relative bg-[#F9FAFB] min-h-[100dvh] pt-12 pb-24 px-4 font-sans overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400 opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EBFF00] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Navigation */}
        <div className="w-full mb-12 flex justify-start">
          <button
            onClick={() => navigateTo('HOME')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-all bg-white px-5 py-2.5 rounded-full text-sm border border-gray-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Home
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-[#EBFF00] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6 shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            Premium Access
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 leading-tight">
             Accelerate Your Career
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl">
             Choose a plan that fits your timeline. Unlock limitless course generations and full Coding Academy access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full items-start">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.15)] md:-mt-4 md:mb-4' 
                  : 'border border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md z-10">
                  Most Popular
                </div>
              )}
              
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mt-2" style={{ backgroundColor: plan.color + '15', border: `1px solid ${plan.color}30` }}>
                <svg className="w-7 h-7" style={{ color: plan.color }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
              
              <h3 className="text-xl font-extrabold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-6">{plan.duration}</p>
              
              <div className="mb-8 flex items-baseline gap-1 relative">
                <span className="text-2xl font-bold text-gray-400 self-start mt-1">₹</span>
                <span className="text-[3.5rem] leading-none font-black text-gray-900 tracking-tighter">{plan.price}</span>
              </div>
              
              <ul className="text-left text-[15px] font-medium text-gray-600 space-y-4 mb-8 w-full flex-1">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> 
                  <span>Unlimited course generations</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> 
                  <span>All course sections unlocked</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> 
                  <span>Full Coding Academy access</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> 
                  <span>Interactive quizzes & exams</span>
                </li>
              </ul>
              
              <button
                onClick={() => handlePayment(plan)}
                className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer border-none flex justify-center items-center gap-2"
                style={{ backgroundColor: plan.popular ? '#3b82f6' : '#111827' }}
              >
                Get {plan.name}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className="mt-16 w-full max-w-[500px] bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center">
          <p className="text-base font-bold text-gray-900 mb-4">Have a special coupon code?</p>
          <div className="flex w-full gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={e => { setCouponCode(e.target.value); setCouponError('') }}
              placeholder="Enter coupon code"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 outline-none focus:border-[#EBFF00] focus:shadow-[0_0_0_4px_rgba(235,255,0,0.15)] focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
            />
            <button
              onClick={handleCoupon}
              className="px-6 py-3 bg-gray-900 text-white font-bold text-[15px] rounded-xl cursor-pointer border-none hover:bg-black transition-all active:scale-[0.97]"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-red-500 text-sm mt-3 font-semibold">{couponError}</p>}
        </div>

      </div>
    </div>
  );
};

export default Pricing;
