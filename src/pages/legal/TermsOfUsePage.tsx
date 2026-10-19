import React from 'react';
import { motion } from 'motion/react';
import { Gavel, Scale, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Terms of Use</h1>
          <p className="text-muted-foreground text-lg">
            Effective Date: April 14, 2026
          </p>
        </motion.div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Gavel size={24} />
              <h2 className="text-2xl font-bold m-0">1. Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Techtural BuiltIn website and services, you agree to be bound by these Terms of Use and all applicable laws and regulations in <strong>Papua New Guinea</strong>. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Scale size={24} />
              <h2 className="text-2xl font-bold m-0">2. Professional Standards</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Our services are provided in accordance with the professional and ethical standards established by the <strong>Institute of Engineers Papua New Guinea (IEPNG)</strong>. Users of our Cost Estimator and Design Selector tools acknowledge that these tools provide estimates and recommendations based on user input and should be verified by a qualified professional before any construction begins.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <CheckCircle size={24} />
              <h2 className="text-2xl font-bold m-0">3. Intellectual Property</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All content, designs, logos, and software on this website are the intellectual property of Techtural BuiltIn or its licensors. You are granted a limited, non-exclusive license to access the content for personal, non-commercial use related to your construction projects.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <AlertCircle size={24} />
              <h2 className="text-2xl font-bold m-0">4. Limitation of Liability</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Techtural BuiltIn shall not be held liable for any damages arising out of the use or inability to use the materials on our website. While we strive for accuracy, we do not warrant that any of the materials on our website are accurate, complete, or current. All construction projects must comply with <strong>NCDC Building Board</strong> regulations and relevant PNG building codes.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Scale size={24} />
              <h2 className="text-2xl font-bold m-0">5. Governing Law</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Any claim relating to Techtural BuiltIn's website shall be governed by the laws of <strong>Papua New Guinea</strong> without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="p-8 bg-muted rounded-3xl border border-border/50">
            <h3 className="text-xl font-bold mb-4 m-0">Compliance Notice</h3>
            <p className="text-muted-foreground mb-0">
              Techtural BuiltIn operates in full compliance with the <strong>Department of PNGICT</strong> digital service standards and <strong>NCDC</strong> municipal regulations for professional services within the National Capital District.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
