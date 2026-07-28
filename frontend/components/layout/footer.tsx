import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact-footer" className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SIH</span>
              </div>
              <span className="font-semibold text-white text-lg tracking-tight">
                SIH 2026 <span className="text-slate-600">|</span> IET DDUGU
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Official institutional portal of Institute of Engineering &amp; Technology, Deen Dayal Upadhyay Gorakhpur University for Smart India Hackathon 2026.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Updates &amp; Notices</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">Event Timeline</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">Registration Forms</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">Student Resources</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Desk</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">SPOC Email</p>
                  <a href="mailto:arun.iet@ddugu.ac.in" className="hover:text-white transition-colors">
                    arun.iet@ddugu.ac.in
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">SOCC Desk</p>
                  <a href="mailto:socc.ietgkp@gmail.com" className="hover:text-white transition-colors">
                    socc.ietgkp@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-slate-400">
                    Institute of Engineering &amp; Technology,<br />
                    DDU Gorakhpur University,<br />
                    Gorakhpur, UP - 273009
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SIH IET DDUGU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
