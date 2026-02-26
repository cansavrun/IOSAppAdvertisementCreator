import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="text-lg font-semibold text-white">
              Reels Creator
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
            AI-Powered Creative Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Create stunning reels,
            <br />
            posts & screenshots
            <br />
            <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chat with AI to generate and edit Instagram Reels, Posts, and App
            Store screenshots. Just describe what you want and watch it come to
            life.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="bg-white text-black px-8 py-3.5 rounded-xl font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
              Start Creating Free
            </Link>
            <a href="#demo" className="text-gray-400 hover:text-white px-8 py-3.5 rounded-xl font-medium text-lg border border-white/20 hover:border-white/40 transition-colors">
              See Demo
            </a>
          </div>

          {/* App preview mockup */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-surface overflow-hidden shadow-2xl shadow-accent/5">
              {/* Fake browser bar */}
              <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 mx-8">
                  <div className="h-5 bg-white/5 rounded-md max-w-xs mx-auto" />
                </div>
              </div>
              {/* Fake app layout */}
              <div className="flex h-[400px]">
                {/* Fake chat panel */}
                <div className="w-1/3 border-r border-white/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <div className="h-3 bg-white/10 rounded w-20" />
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-accent/30 rounded-xl px-3 py-2 max-w-[80%]">
                      <div className="h-3 bg-white/20 rounded w-full mb-1.5" />
                      <div className="h-3 bg-white/20 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 max-w-[80%]">
                      <div className="h-3 bg-white/10 rounded w-full mb-1.5" />
                      <div className="h-3 bg-white/10 rounded w-full mb-1.5" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs px-2 py-1 bg-white/5 rounded-md">
                    <div className="w-3 h-3 rounded-full border-2 border-accent/40 border-t-accent animate-spin" />
                    <div className="h-2.5 bg-accent/20 rounded w-24" />
                  </div>
                </div>
                {/* Fake canvas */}
                <div className="flex-1 p-4 grid grid-cols-3 gap-3">
                  {[
                    "from-blue-500/20 to-purple-500/20",
                    "from-orange-500/20 to-pink-500/20",
                    "from-green-500/20 to-teal-500/20",
                    "from-rose-500/20 to-amber-500/20",
                    "from-indigo-500/20 to-cyan-500/20",
                    "from-violet-500/20 to-fuchsia-500/20",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`rounded-lg bg-gradient-to-br ${gradient} border border-white/5 flex items-center justify-center`}
                    >
                      <div className="w-8 h-8 rounded bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by / stats */}
        <section className="border-y border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "15+", label: "AI Models" },
                { value: "9:16", label: "Reel Format" },
                { value: "4K", label: "Max Resolution" },
                { value: "30min", label: "Max Video Length" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to create
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From generation to editing, our AI handles the entire creative workflow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Instagram Reels",
                description: "Generate 9:16 vertical videos from text or images. Apply style transfers, extend duration, refine through chat.",
                features: ["Text-to-video", "Image-to-video", "Style transfer", "Video extension"],
                gradient: "from-purple-500/20 to-blue-500/20",
              },
              {
                title: "Instagram Posts",
                description: "Create 1:1 or 4:5 images with AI. Remove backgrounds, upscale, apply styles, and edit with natural language.",
                features: ["Text-to-image", "Background removal", "Upscaling (4x)", "Style transfer"],
                gradient: "from-pink-500/20 to-orange-500/20",
              },
              {
                title: "App Store Screenshots",
                description: "Professional App Store screenshots with device frames, marketing text, and beautiful backgrounds.",
                features: ["Device frames", "Text overlays", "AI backgrounds", "Batch export"],
                gradient: "from-green-500/20 to-teal-500/20",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 overflow-hidden"
              >
                <div className={`h-40 bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <div className="text-4xl font-bold text-white/10">{feature.title.split(" ")[0]}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-1.5">
                    {feature.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Copilot section */}
        <section id="demo" className="border-t border-white/10 py-24 bg-gradient-to-b from-accent/5 to-transparent">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-4 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                  AI Copilot
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Create and edit by chatting
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Our AI copilot understands your creative intent. Just describe
                  what you want, and it picks the right model, generates content,
                  and lets you iteratively refine through conversation.
                </p>
                <div className="space-y-4">
                  {[
                    { q: "Create a reel of a sunset beach", a: "Generating a cinematic 9:16 video..." },
                    { q: "Make it more dramatic", a: "Applying style transfer with enhanced contrast..." },
                    { q: "Remove the background from image 1", a: "Background removed using Bria RMBG..." },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="bg-accent text-white text-sm rounded-xl px-3 py-2 max-w-[80%]">
                          {item.q}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="bg-white/5 border border-white/5 text-gray-300 text-sm rounded-xl px-3 py-2 max-w-[80%]">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-surface p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-20 rounded-lg bg-gradient-to-br ${
                    i % 2 === 0 ? "from-purple-500/20 to-blue-500/20" : "from-orange-500/20 to-pink-500/20"
                  } border border-white/5`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">Three steps to professional content</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Describe your idea", description: "Chat with our AI copilot. Say \"create a reel of a sunset beach\" and it gets to work." },
              { step: "2", title: "AI generates it", description: "Our AI picks the best model and generates your content. Multiple items generate simultaneously." },
              { step: "3", title: "Edit & refine", description: "\"Make it more cinematic\", \"remove the background\", \"extend the video\" \u2014 just chat to edit." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-white/10 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple pricing</h2>
              <p className="text-gray-400">Pay for what you use. No monthly subscriptions.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  name: "Free",
                  price: "$0",
                  description: "Try it out",
                  features: ["5 image generations", "1 video generation", "Basic editing tools", "720p exports"],
                  cta: "Get Started",
                  highlight: false,
                },
                {
                  name: "Pro",
                  price: "$19",
                  period: "/month",
                  description: "For creators",
                  features: ["100 image generations/mo", "20 video generations/mo", "All editing tools", "4K exports", "Priority generation", "App Store screenshots"],
                  cta: "Start Pro Trial",
                  highlight: true,
                },
                {
                  name: "Business",
                  price: "$49",
                  period: "/month",
                  description: "For teams",
                  features: ["Unlimited generations", "All Pro features", "Team collaboration", "API access", "Custom branding", "Priority support"],
                  cta: "Contact Sales",
                  highlight: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-6 ${
                    plan.highlight
                      ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {plan.highlight && (
                    <div className="text-xs font-medium text-accent mb-3">Most Popular</div>
                  )}
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-2 mb-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-500 mb-6">{plan.description}</p>
                  <Link
                    href="/signup"
                    className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      plan.highlight
                        ? "bg-accent text-white hover:bg-accent-hover"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="mt-6 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center bg-gradient-to-b from-accent/5 to-transparent border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to create?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Join creators using AI to produce professional content in minutes, not hours.
            </p>
            <Link href="/signup" className="inline-block bg-white text-black px-8 py-3.5 rounded-xl font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xs">R</div>
                <span className="text-sm font-semibold text-white">Reels Creator</span>
              </div>
              <p className="text-sm text-gray-500">AI-powered creative studio for social media content.</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Create</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Instagram Reels</li>
                <li>Instagram Posts</li>
                <li>App Store Screenshots</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Powered by</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>fal.ai</li>
                <li>Claude AI</li>
                <li>FLUX, Kling, Veo</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex items-center justify-between text-sm text-gray-600">
            <span>Reels Creator</span>
            <span>Built with fal.ai & Claude</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
