import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, ArrowRight, FileText, BookOpen, Download, BarChart3 } from 'lucide-react';
import { Section, SectionHeader } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { resources } from '../../lib/data';
import { cn } from '../../lib/utils';
import { SEO } from '../../components/SEO';

const categories = ['All', 'Excel Tips', 'Hospital Management', 'Business Systems'];

export function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const blogPosts = useQuery(api.content.listBlogPosts, {});

  const filteredPosts = (blogPosts || []).filter((p: any) => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (blogPosts === undefined) {
    return <div className="pt-24 md:pt-28"><Section><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></Section></div>;
  }

  return (
    <>
      <SEO
        title="Resources & Insights"
        description="Expert guides, case studies, articles and tutorials to help organizations in East Africa build better systems, sharper operations and stronger outcomes."
        canonical="/resources"
      />
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Resources</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Insights, guides, and tools to help you build a better organization.</p>
        </motion.div>
      </Section>

      <Section>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors',
                  activeCategory === cat ? 'bg-primary text-white' : 'bg-section text-text-secondary hover:bg-section-alt'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: any, idx: number) => (
            <Link key={post._id} to={`/resources/${post.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-lg border border-border bg-white overflow-hidden hover:shadow-card-hover transition-all"
              >
                <div className="aspect-[16/9] bg-linear-to-br from-section to-section-alt flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-text-muted/40" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min read
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                  <Button variant="ghost" size="sm">
                    Read More <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </Section>

      {/* Free Resources */}
      <Section variant="section">
        <SectionHeader title="Free Resources" subtitle="Download free templates and tools to get started." />
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                {resource.type === 'template' ? <Download className="w-6 h-6 text-accent" /> :
                 resource.type === 'case_study' ? <BarChart3 className="w-6 h-6 text-accent" /> :
                 <FileText className="w-6 h-6 text-accent" />}
              </div>
              <Badge variant="accent" size="sm" className="mb-2 capitalize">{resource.type.replace('_', ' ')}</Badge>
              <h3 className="font-heading font-bold text-primary mb-2">{resource.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{resource.description}</p>
              <a href={resource.url} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
                {resource.type === 'template' ? 'Download' : 'Read More'}
                <ArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
    </>
  );
}
