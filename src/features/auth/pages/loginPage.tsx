import { LoginForm } from '../components/loginForm';
export default function Page() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center p-6 md:p-10">
      {/* Top 50% - Primary */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary" />

      {/* Bottom 50% - Default */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-accent/50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Custom Card Container */}
        <div className="flex w-full rounded-xl overflow-hidden shadow-2xl border-0 border-border bg-white">
          {/* LEFT (60%) - Login Form */}
          <div className="w-[50%] bg-white p-8 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>

          {/* RIGHT (40%) - Logo Section */}
          <div className="w-[50%] bg-accent justify-center p-6 pt-10">
            <img
              src="/Images/Wordmark_1.png"
              alt="Bizverto Logo"
              className="h-48 w-150 object-contain drop-shadow-xl"
            />
            <p className="text-center text-[16px] pl-1 pr-1 font-semibold text-black/75 tracking-tight relative bottom-10 leading-relaxed">
              Empowering businesses with automation, intelligence & seamless
              customer engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
