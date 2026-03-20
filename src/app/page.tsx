import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, Zap, Shield, Code, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-emerald-200">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">PlugPay</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link className="hover:text-emerald-600 transition-colors" href="#features">Features</Link>
          <Link className="hover:text-emerald-600 transition-colors" href="#developers">Developers</Link>
          <Link className="hover:text-emerald-600 transition-colors" href="#pricing">Pricing</Link>
          <Link className="hover:text-emerald-600 transition-colors" href="/dashboard">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="text-sm font-medium">Log in</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 px-4 sm:px-6 font-semibold text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px]" />
          </div>

          <div className="container px-6 mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Now live for M-Pesa C2B & B2C
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              The Stripe for <span className="text-emerald-600">M-Pesa</span> integration
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Integrate M-Pesa payments into your SaaS, marketplace, or mobile app in minutes. One API, multiple methods, zero complexity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-slate-900 hover:bg-black text-white px-10 h-14 rounded-xl text-lg font-bold shadow-xl">
                  Start Building Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-10 h-14 rounded-xl text-lg font-bold border-gray-200">
                Contact Sales
              </Button>
            </div>
            
            {/* Dashboard Mockup Preview */}
            <div className="mt-20 relative p-2 bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden max-w-5xl mx-auto group">
              <div className="w-full h-[400px] bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-mono text-sm overflow-hidden">
                 <div className="w-full h-full flex flex-col bg-white">
                    <div className="h-10 border-b border-gray-100 flex items-center px-4 gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-400" />
                       <div className="w-2 h-2 rounded-full bg-amber-400" />
                       <div className="w-2 h-2 rounded-full bg-emerald-400" />
                       <div className="flex-1 text-center text-[10px] text-gray-400">api.plugpay.com/v1/payments</div>
                    </div>
                    <div className="flex-1 p-8 text-left bg-slate-950 text-emerald-400 font-mono text-sm overflow-hidden">
                       <pre>
{`POST /v1/payments
Authorization: Bearer mpl_test_7a2...
Content-Type: application/json

{
  "phoneNumber": "254712345678",
  "amount": 1500,
  "reference": "ORDER-12345",
  "description": "Premium Subscription"
}

// 201 Created
{
  "success": true,
  "checkoutRequestId": "ws_CO_20032026...",
  "status": "PENDING"
}`}
                       </pre>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Why PlugPay?</h2>
              <p className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need to scale payments in East Africa</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Developer First", icon: Code, desc: "Clean SDKs, comprehensive documentation, and a robust sandbox environment." },
                { title: "Real-time Analytics", icon: Zap, desc: "Monitor every transaction as it happens with instant webhook notifications." },
                { title: "Secure by Design", icon: Shield, desc: "PCI-DSS compliant standards with encrypted API keys and audit logs." },
                { title: "Global Reach", icon: Globe, desc: "Start in Kenya with M-Pesa. Scale to Airtal Money and beyond coming soon." },
                { title: "Reliability", icon: CheckCircle, desc: "99.9% uptime with automated retries and failover handling." },
                { title: "Plug-and-Play", icon: Zap, desc: "No complex bank negotiations. Connect your shortcode and start collecting." },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-white rounded-full" />
          </div>
          <div className="container px-6 mx-auto text-center relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8">Ready to supercharge your business?</h2>
            <p className="text-emerald-50 mb-12 text-xl max-w-2xl mx-auto">
              Join 500+ developers building with PlugPay today.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-12 h-16 rounded-2xl text-xl font-bold shadow-2xl">
                Get Your API Key <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="container mx-auto grid gap-12 grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Zap className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">PlugPay</span>
            </div>
            <p className="text-sm">Revolutionizing mobile money for the modern web.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-emerald-500">API Reference</Link></li>
              <li><Link href="#" className="hover:text-emerald-500">Pricing</Link></li>
              <li><Link href="#" className="hover:text-emerald-500">Sandbox</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-emerald-500">About Us</Link></li>
              <li><Link href="#" className="hover:text-emerald-500">Careers</Link></li>
              <li><Link href="#" className="hover:text-emerald-500">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-emerald-500">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-500">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-500">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Mwenaro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
