import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageCircle, Heart, Briefcase, Video, CreditCard } from 'lucide-react';

const footerLinks = {
  products: {
    title: 'Products',
    links: [
      { label: 'Financial Models', url: '/store?category=financial-models' },
      { label: 'Dashboards', url: '/store?category=dashboards' },
      { label: 'Budget Templates', url: '/store?category=budget-templates' },
      { label: 'HR Systems', url: '/store?category=hr-systems' },
      { label: 'Bundles', url: '/store?category=bundles' },
      { label: 'All Products', url: '/store' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Blog', url: '/resources' },
      { label: 'Guides', url: '/resources' },
      { label: 'Case Studies', url: '/resources' },
      { label: 'Free Templates', url: '/resources' },
      { label: 'FAQ', url: '/faq' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Contact Us', url: '/contact' },
      { label: 'Help Center', url: '/contact' },
      { label: 'WhatsApp', url: 'https://wa.me/256700123456' },
      { label: 'Email Support', url: 'mailto:hello@trueworks.ug' },
    ],
  },
  policies: {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Terms of Service', url: '/terms' },
      { label: 'Refund Policy', url: '/refund-policy' },
      { label: 'FAQ', url: '/faq' },
    ],
  },
};

const socialLinks = [
  { icon: Globe, url: '#', label: 'Facebook' },
  { icon: MessageCircle, url: '#', label: 'Twitter' },
  { icon: Heart, url: '#', label: 'Instagram' },
  { icon: Briefcase, url: '#', label: 'LinkedIn' },
  { icon: Video, url: '#', label: 'YouTube' },
];

const paymentIcons = [
  { icon: CreditCard, label: 'Visa' },
  { icon: CreditCard, label: 'Mastercard' },
  { icon: CreditCard, label: 'Mobile Money' },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="py-16 md:py-20 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white font-heading font-bold">TW</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-lg text-white">TrueWorks</span>
                  <span className="block text-[10px] text-white/50 tracking-widest uppercase">Limited</span>
                </div>
              </Link>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                Premium business templates, financial models, and digital systems built by professionals for organizations across Africa.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <social.icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
            {Object.values(footerLinks).map((group) => (
              <div key={group.title}>
                <h4 className="font-heading font-bold text-sm text-white/80 mb-4 uppercase tracking-wider">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.url} className="text-sm text-white/60 hover:text-accent transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>hello@trueworks.ug</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+256 700 123 456</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Kampala, Uganda</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {paymentIcons.map((p) => (
              <div key={p.label} className="px-3 py-1.5 rounded bg-white/10 text-xs text-white/60 flex items-center gap-1.5">
                <p.icon className="w-3.5 h-3.5" />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} TrueWorks Limited. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Building Better Organizations
          </p>
        </div>
      </div>
    </footer>
  );
}
