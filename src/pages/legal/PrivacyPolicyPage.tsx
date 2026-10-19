import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: April 14, 2026
          </p>
        </motion.div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Shield size={24} />
              <h2 className="text-2xl font-bold m-0">1. Introduction</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Techtural BuiltIn ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, in accordance with the guidelines set by the <strong>Department of Information and Communications Technology (PNGICT)</strong> and relevant governing bodies in the <strong>National Capital District (NCDC)</strong>.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Eye size={24} />
              <h2 className="text-2xl font-bold m-0">2. Information We Collect</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Register on our platform or use our Cost Estimator tool.</li>
              <li>Submit a project discovery request or contact form.</li>
              <li>Subscribe to our newsletter or marketing communications.</li>
              <li>Interact with our customer support team.</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This information may include your name, email address, phone number, company details, and project-specific data.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Lock size={24} />
              <h2 className="text-2xl font-bold m-0">3. How We Use Your Information</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain our architectural and construction services.</li>
              <li>Process your project estimates and design recommendations.</li>
              <li>Communicate with you regarding project updates and inquiries.</li>
              <li>Comply with professional standards set by the <strong>Institute of Engineers Papua New Guinea (IEPNG)</strong>.</li>
              <li>Improve our website functionality and user experience.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <FileText size={24} />
              <h2 className="text-2xl font-bold m-0">4. Data Security & Storage</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to maintain the safety of your personal information. Your data is stored on secure servers, and we use encryption where appropriate. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Shield size={24} />
              <h2 className="text-2xl font-bold m-0">5. Your Rights</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal information held by us. If you wish to exercise these rights, please contact us at <strong>techtural782@gmail.com</strong>.
            </p>
          </section>

          <section className="p-8 bg-muted rounded-3xl border border-border/50">
            <h3 className="text-xl font-bold mb-4 m-0">Contact Information</h3>
            <p className="text-muted-foreground mb-0">
              If you have any questions about this Privacy Policy, please contact our Data Protection Officer:<br />
              <strong>Email:</strong> gerea.george@techturalpng.com<br />
              <strong>Address:</strong> PO Box 1585, Port Moresby, NCD, Papua New Guinea
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
