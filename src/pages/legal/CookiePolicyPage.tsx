import React from 'react';
import { motion } from 'motion/react';
import { Cookie, Info, Settings, ShieldCheck } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: April 14, 2026
          </p>
        </motion.div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Cookie size={24} />
              <h2 className="text-2xl font-bold m-0">1. What are Cookies?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Info size={24} />
              <h2 className="text-2xl font-bold m-0">2. How We Use Cookies</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Techtural BuiltIn uses cookies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Remember your preferences and settings (e.g., Cost Estimator inputs).</li>
              <li>Understand how you use our website and tools.</li>
              <li>Improve our services and provide a more personalized experience.</li>
              <li>Ensure the security of our platform and prevent fraud.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <ShieldCheck size={24} />
              <h2 className="text-2xl font-bold m-0">3. Types of Cookies We Use</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 bg-muted rounded-2xl border border-border/50">
                <h4 className="font-bold mb-2 m-0">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground m-0">Necessary for the website to function properly, such as authentication and security.</p>
              </div>
              <div className="p-6 bg-muted rounded-2xl border border-border/50">
                <h4 className="font-bold mb-2 m-0">Performance Cookies</h4>
                <p className="text-sm text-muted-foreground m-0">Collect information about how visitors use the site to help us improve performance.</p>
              </div>
              <div className="p-6 bg-muted rounded-2xl border border-border/50">
                <h4 className="font-bold mb-2 m-0">Functional Cookies</h4>
                <p className="text-sm text-muted-foreground m-0">Allow the website to remember choices you make (like your username or region).</p>
              </div>
              <div className="p-6 bg-muted rounded-2xl border border-border/50">
                <h4 className="font-bold mb-2 m-0">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground m-0">Used to track website traffic and user behavior patterns.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Settings size={24} />
              <h2 className="text-2xl font-bold m-0">4. Managing Cookies</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to alert you when cookies are being sent. However, please note that some parts of our website may not function properly if you disable cookies.
            </p>
          </section>

          <section className="p-8 bg-primary/5 rounded-3xl border border-primary/20">
            <h3 className="text-xl font-bold mb-4 m-0">Compliance Statement</h3>
            <p className="text-muted-foreground mb-0">
              Our use of cookies is aligned with the <strong>Department of PNGICT</strong> cybersecurity guidelines and international best practices for data privacy and user consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
