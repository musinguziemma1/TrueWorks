import { motion } from 'framer-motion';
import { Target, Heart, Award, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { Section, SectionHeader } from '../../components/ui/Section';
import { StatCard } from '../../components/ui/StatCard';
import { FeatureCard } from '../../components/ui/FeatureCard';
import { Badge } from '../../components/ui/Badge';
import { SEO } from '../../components/SEO';

const timeline = [
  { year: '2020', title: 'Founded in Kampala', description: 'TrueWorks Limited was established to bridge the gap between professional business systems and African organizations.' },
  { year: '2021', title: 'First 50 Customers', description: 'Reached our first 50 organizational customers across healthcare, NGO, and finance sectors.' },
  { year: '2022', title: 'Product Expansion', description: 'Launched 15+ new templates including the Hospital KPI Dashboard and Financial Model Toolkit.' },
  { year: '2023', title: 'Regional Growth', description: 'Expanded across East Africa with customers in Kenya, Tanzania, Rwanda, and Uganda.' },
  { year: '2024', title: 'Enterprise Partnerships', description: 'Partnered with leading organizations and consultancies to deliver custom solutions.' },
  { year: '2025', title: 'Digital Platform Launch', description: 'Launched our full e-commerce platform with instant download and mobile money payments.' },
];

const values = [
  { icon: Award, title: 'Excellence', description: 'We deliver only the highest quality business systems that meet professional standards.' },
  { icon: Target, title: 'Precision', description: 'Every template is rigorously tested and built with meticulous attention to detail.' },
  { icon: Heart, title: 'Impact', description: 'We measure our success by the impact our tools have on organizational effectiveness.' },
  { icon: Users, title: 'Partnership', description: 'We work alongside our customers to understand their unique challenges and needs.' },
  { icon: TrendingUp, title: 'Innovation', description: 'Continuous improvement drives everything we build, ensuring our customers stay ahead.' },
  { icon: ShieldCheck, title: 'Integrity', description: 'Transparent pricing, clear policies, and honest communication in everything we do.' },
];

export function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about TrueWorks Limited — our mission to build premium, institution-grade Excel templates and business systems for organizations across East Africa and beyond."
        canonical="/about"
        jsonLd={{
          '@type': 'AboutPage',
          name: 'About TrueWorks',
          description: 'Our story, values and mission.',
        }}
      />
    <div className="pt-24 md:pt-28">
      {/* Hero */}
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge variant="accent" size="md" className="mb-4">Our Story</Badge>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Building Better Organizations<br />
            <span className="text-accent">Across Africa</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto">
            TrueWorks Limited is a Ugandan company dedicated to creating professional business systems that help organizations operate more efficiently, make better decisions, and achieve their missions.
          </p>
        </motion.div>
      </Section>

      {/* Stats */}
      <Section variant="section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Years in Business" value="5+" />
          <StatCard label="Templates Built" value="45+" />
          <StatCard label="Organizations Served" value="50+" />
          <StatCard label="Customer Satisfaction" value="98%" />
        </div>
      </Section>

      {/* Story */}
      <Section>
        <SectionHeader
          title="Our Mission"
          subtitle="To empower African organizations with world-class business systems that drive efficiency, transparency, and growth."
          align="left"
        />
        <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
          <div>
            <p className="text-text-secondary leading-relaxed mb-4">
              TrueWorks was founded on a simple observation: organizations across East Africa were using outdated spreadsheets, manual processes, and generic templates that didn't meet their specific needs.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              We believed that African organizations deserved better, professional-grade business systems built with an understanding of local contexts, regulations, and challenges.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Today, we serve hospitals, NGOs, schools, churches, and businesses across East Africa, providing them with the tools they need to build better organizations.
            </p>
          </div>
          <div className="aspect-4/3 rounded-xl bg-linear-to-br from-primary to-primary-light border border-white/10 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-heading font-bold text-3xl">TW</span>
              </div>
              <p className="text-white/80 font-heading text-lg italic">"Building Better Organizations"</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Standards */}
      <Section variant="section">
        <SectionHeader title="Our Standards" subtitle="Every template is built, tested, and used in real organizations before we sell it." align="left" />
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 rounded-lg border border-border bg-white">
            <h3 className="font-heading font-bold text-primary mb-2">Built by Practitioners</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every template is designed by professionals with hands-on experience in hospital management, financial systems, and organizational operations across East Africa.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-white">
            <h3 className="font-heading font-bold text-primary mb-2">Tested in Real Organizations</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Before launch, each system is used in actual hospitals, NGOs, and businesses. We refine based on real-world feedback until it works flawlessly.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-white">
            <h3 className="font-heading font-bold text-primary mb-2">Finished to Boardroom Standard</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Every template is presentation-ready. Clean formatting, professional design, and outputs that boards, donors, and auditors can trust.
            </p>
          </div>
        </div>
      </Section>

      {/* Founder */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square rounded-xl bg-linear-to-br from-primary to-primary-light flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-accent bg-primary-light flex items-center justify-center">
                <span className="text-accent font-heading font-bold text-4xl">TW</span>
              </div>
              <p className="text-white font-heading text-lg font-bold">Founder</p>
              <p className="text-white/60 text-sm">TrueWorks Limited</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">From the Founder</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">A Background in Hospital Management and Financial Systems</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              The founder of TrueWorks spent years managing hospital finances and building business systems for organizations across East Africa. This hands-on experience revealed a consistent gap: organizations needed professional-grade tools but had only generic templates or expensive custom solutions.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              TrueWorks was created to fill that gap. Every product reflects real problems solved in real organizations, from hospital budgeting to NGO grant management to church financial stewardship.
            </p>
            <p className="text-text-secondary leading-relaxed">
              The goal is simple: give African organizations the same quality of business systems that large corporations take for granted, at a price that makes sense for the market.
            </p>
          </div>
        </div>
      </Section>

      {/* Vision */}
      <Section variant="dark" className="text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Our Vision</h2>
        <div className="w-16 h-1 bg-accent mx-auto mb-6" />
        <p className="text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
          To become the leading provider of professional business systems for organizations across Africa, empowering them to operate with the same efficiency, transparency, and accountability as the best-run institutions worldwide.
        </p>
      </Section>

      {/* Values */}
      <Section variant="section">
        <SectionHeader title="Our Values" subtitle="The principles that guide everything we build." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <FeatureCard key={value.title} {...value} variant="horizontal" />
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader title="Our Journey" subtitle="From a simple idea to a trusted partner for organizations across East Africa." />
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
          {timeline.map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative pl-12 md:pl-0 md:w-1/2 pb-12 ${idx % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}
            >
              <div className="absolute left-4 md:left-auto top-1 w-4 h-4 rounded-full bg-accent border-4 border-section z-10" style={idx % 2 === 0 ? { right: '-8px', left: 'auto' } : { left: '-8px', right: 'auto' }} />
              <div className="p-5 rounded-lg border border-border bg-white hover:shadow-card-hover transition-shadow">
                <span className="text-sm font-bold text-accent">{item.year}</span>
                <h3 className="font-heading font-bold text-primary mt-1 mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
    </>
  );
}


