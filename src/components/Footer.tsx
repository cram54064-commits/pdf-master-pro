import React from 'react';
import { FileText, Shield, Lock, Laptop, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, arg?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Privacy Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Private Client-Side</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your files are processed directly in your web browser. Documents never leave your device.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">No Cloud Storage</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Temporary memory is automatically freed after processing. No third-party data collection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">50 Dedicated Tools</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete suite for organizing, converting, compressing, editing, signing, and securing PDFs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">PDF Master Pro</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
              The modern, privacy-first PDF workstation for professionals, students, and businesses. Convert,
              compress, edit, and organize documents without compromising sensitive information.
            </p>
            <p className="text-xs text-slate-500">
              Built with open browser standards and WebAssembly technology.
            </p>
          </div>

          {/* Quick Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Popular Tools</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('tool', 'merge-pdf')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Merge PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'split-pdf')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Split PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'compress-pdf')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Compress PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'pdf-to-word')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  PDF to Word
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tool', 'sign-pdf')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sign PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Resources</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Legal & Privacy</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cookie')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Directory (50 Tools)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PDF Master Pro. All rights reserved. Zero tracking cookies.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered for privacy and performance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
