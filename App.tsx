import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { BlogListItem, BlogDetail } from './components/BlogComponents';
import { Button, Input } from './components/UI';
import { BlogPost, UserProfile } from './types';
import { Linkedin, Github } from 'lucide-react';

// --- Mock Data ---
const PROFILE: UserProfile = {
  name: "Théophilus Homawoo",
  role: "AI Product Engineer",
  bio: "Exploring the intersection of artificial intelligence, product design, and human cognition. Building minimalist interfaces for complex systems.",
  // A rounded dark themed image placeholder
  avatarUrl: "/profilpic.jpg"
};

const POSTS: BlogPost[] = [
  {
    id: '4',
    title: "From Undo Rate to Useful Signal: Instrumenting Reversibility in Practice",
    date: "Nov 15, 2023",
    excerpt: "Tracking reversions is easy. Interpreting them is hard. A user hitting 'undo' compresses multiple failure modes into a single binary event. Here is how to tease them apart.",
    tags: ["Product", "Metrics", "AI Safety"],
    readTime: "8 min read",
    content: `I just posted this on LinkedIn to argue that AI safety conversations over-index on preventing mistakes and underinvest in making them cheap to undo. The core idea: for reversible tasks, optimize for trivial reversion rather than strict pre-approval.

I don't have feedback yet, but the immediate question that typically follows is: *Okay, but how?* A 30% undo rate is uninterpretable on its own. It could mean your model is struggling, your users are exploring, or your instructions are unclear. Here's how you'd tease those apart.

## The Core Problem: Raw Undo Rate Is Noise

Tracking reversions is easy. Interpreting them is hard. A user hitting "undo" compresses multiple failure modes into a single binary event. Without structure, you're flying blind.

## 1. Distinguish Undo Types

Not all reversions indicate model failure. You need to tag the *reason*:

- **Correction:** Output was wrong or low-quality (the signal you want)
- **Preference:** Output was fine, user just wanted something different
- **Exploration:** User was trying options, not evaluating quality
- **Cascading:** Undoing because something downstream broke

Only **Correction** cleanly indicates model failure. The others are noise for quality measurement (though still useful for understanding usage patterns).

**How to capture this:**

- **Lightweight:** One-click reason selector on undo (takes 2 seconds)
- **Passive:** Infer from behavioral signals. A reversion after 3 seconds and zero edits? Likely Correction. After 5 minutes and multiple tweaks? Probably Preference.

## 2. Measure Time-to-Undo

Speed matters. The distribution tells you different things:

- **<10-30 seconds:** Obvious errors. User glanced and immediately rejected.
- **2-3 days:** Delayed consequences. Subtle problems that surfaced in use, or changed requirements.
- **Flat distribution:** Likely Preference/Exploration noise.

A spike at under 10 seconds means your model is producing visibly bad outputs. A spike at 2-3 days means you're hitting the caveat I mentioned—undo doesn't help with downstream failures.

## 3. Track Undo Depth, Not Just Occurrence

What happens *after* the undo matters more than the undo itself:

- **Undo → manual rewrite:** Model couldn't do the task
- **Undo → re-prompt → accept:** Model could do it, instructions were unclear
- **Undo → re-prompt → undo again → give up:** Task likely outside model capability

The recovery path pinpoints where the failure lives: model, prompt, or task design.

## 4. Build a Comparison Baseline

Without a baseline, "30% undo rate" is meaningless. Is that good or terrible? Compare:

- **Across task types:** Where does the model struggle most?
- **Across model versions:** A/B test new versions against undo rate
- **Against human baseline:** What was the revision rate before AI? If human drafts had a 25% "undo" equivalent, 30% might be acceptable.

Context transforms a number into a decision.

## 5. Sample for Ground Truth (Catching Automation Bias)

Undo tracking won't catch cases where users *should* have undone but didn't. This is automation bias—blindly trusting the AI.

**Periodically audit accepted outputs:**

- Randomly sample 5% of "accepted" work
- Have a human expert evaluate quality
- Compare audit failure rate to undo rate

If audits find 20% of accepted outputs are poor but only 5% get undone, you've quantified your automation bias gap. That's your ceiling on how much autonomy you can safely grant.

## 6. Instrument the Non-Undos

Tracking *what didn't get undone* is as important as tracking what did:

- **Review time:** How long before accepting? If average review time drops 15% month-over-month, that's early warning of automation bias.
- **Edit rate:** Users who accept then make small tweaks are still engaged. Users who accept with zero changes might not be reading at all.

These metrics catch complacency before it causes damage.

## What You'd Actually See: A Useful Dashboard

A naive dashboard shows:

> **Undo Rate: 30%**

That's useless. A useful dashboard shows:

\`\`\`
Total Reversions: 30%
├─ Correction (quality signal): 18%
├─ Preference/Exploration (usage pattern): 12%

Time-to-Undo Distribution:
├─ <30s (obvious errors): 55%
├─ 30s-24h (prompt refinement): 30%
└─ >24h (delayed consequences): 15%

Recovery Paths:
├─ Undo → Manual Rewrite: 8%
├─ Undo → Re-prompt → Accept: 19%
└─ Undo → Re-prompt → Abandon: 3%

Automation Bias Audit:
├─ Sampled Accept Rate Flagged as Poor: 8%
└─ Estimated True Error Rate: 26%

Review Time Trend: ↓ 15% over past month (warning)
\`\`\`

This tells you *where* the model struggles, *why* users revert, and *how much* bias is creeping in.

## The Honest Caveats

This isn't free. The automation bias audit requires human labor—expensive and hard to maintain at scale. Passive inference of undo reasons works until it doesn't, and you'll need to validate those signals. Most importantly, this framework only applies where reversibility is feasible. For patient-facing decisions or irreversible actions, none of this replaces traditional safety measures.

But for internal workflows where you *can* walk things back, instrumenting reversibility gives you richer, more honest signal than most pre-deployment evals. It's not a paradigm shift. It's just an underweighted factor that deserves more weight than it gets.`
  }
];

export default function App() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handlePostClick = (id: string) => {
    setSelectedPostId(id);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('list');
    setSelectedPostId(null);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // --- Components ---

  const Header = (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="px-6 py-5 md:px-12 flex justify-between items-center">
        <div 
          className="cursor-pointer group"
          onClick={() => handleBack()}
        >
          <h1 className="font-bold tracking-tight text-lg uppercase group-hover:opacity-70 transition-opacity">
            {PROFILE.name}
          </h1>
          <p className="text-xs text-neutral-500 font-mono tracking-widest uppercase mt-1">
            {PROFILE.role}
          </p>
        </div>
        
        <nav className="flex gap-6">
          <a href="#" className="text-sm font-medium hover:line-through decoration-1">Work</a>
          <a href="#" className="text-sm font-medium hover:line-through decoration-1">About</a>
          <a href="#" className="text-sm font-medium hover:line-through decoration-1">Contact</a>
        </nav>
      </div>
    </header>
  );

  const Hero = (
    <section className="px-6 py-20 md:px-12 border-b border-neutral-100 bg-neutral-50/50">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl">
        <div className="shrink-0 relative group">
           {/* Dark themed rounded image */}
           <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-800 shadow-xl filter contrast-125 grayscale hover:grayscale-0 transition-all duration-700">
             <img src={PROFILE.avatarUrl} alt={PROFILE.name} className="w-full h-full object-cover" />
           </div>
        </div>
        <div className="text-center md:text-left">
          <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-800">
            {PROFILE.bio}
          </p>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <a href="https://www.linkedin.com/in/theophilus/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-black transition-colors"><Linkedin size={20} /></a>
            <a href="https://github.com/theohmwoa" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-black transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </div>
    </section>
  );

  const Newsletter = (
    <section className="border-t border-neutral-200 bg-black text-white py-16 px-6 md:px-12">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-2xl font-light mb-4">Join the signal.</h3>
        <p className="text-neutral-400 mb-8 font-light">
          Weekly thoughts on AI engineering and product design. No noise.
        </p>
        
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0">
          <Input 
            type="email" 
            placeholder="email@address.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-white/10 border-white/20 text-white placeholder-neutral-500 focus:bg-white/20 focus:border-white rounded-none"
            required
          />
          <Button 
            type="submit" 
            variant="secondary"
            className="whitespace-nowrap rounded-none border-l-0"
          >
            {subscribed ? "Joined" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );

  const Footer = (
    <footer className="border-t border-neutral-100 py-12 px-6 md:px-12 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-neutral-400">
        <p>&copy; {new Date().getFullYear()} Théophilus Homawoo.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
           <span>System Status: Online</span>
           <span>•</span>
           <span>Paris, France</span>
        </div>
      </div>
    </footer>
  );

  const activePost = POSTS.find(p => p.id === selectedPostId);

  return (
    <Layout header={Header} footer={Footer}>
      {view === 'list' ? (
        <>
          {Hero}
          <div className="flex-grow">
            <div className="px-6 md:px-12 py-8 border-b border-neutral-100 flex justify-between items-end">
               <h2 className="text-sm font-bold tracking-widest uppercase">Latest Thoughts</h2>
               <span className="font-mono text-xs text-neutral-400">{POSTS.length} posts</span>
            </div>
            {POSTS.map(post => (
              <BlogListItem key={post.id} post={post} onClick={handlePostClick} />
            ))}
          </div>
        </>
      ) : activePost ? (
        <BlogDetail post={activePost} onBack={handleBack} />
      ) : (
        <div>Post not found</div>
      )}
    </Layout>
  );
}