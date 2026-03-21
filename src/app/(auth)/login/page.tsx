import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tighter">Mwenaro PlugPay</h1>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium italic leading-relaxed">
              &ldquo;Integrating M-Pesa used to take us weeks. With PlugPay, we were live in under 10 minutes. It's truly the Stripe for Mobile Money.&rdquo;
            </p>
            <footer className="text-sm">
              <cite className="font-semibold not-italic">Alex Maina</cite>
              <span className="block text-indigo-300/80">CTO at TechTuku</span>
            </footer>
          </blockquote>
        </div>

        <div className="relative z-10 text-sm text-indigo-300/60">
          &copy; {new Date().getFullYear()} Mwenaro. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-12 flex justify-center">
             <h1 className="text-2xl font-bold text-indigo-800">Mwenaro PlugPay</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
