import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Tag, ChevronRight } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Section } from '../../components/ui/Section';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export function BlogPost() {
  const { slug } = useParams();
  const post = useQuery(api.content.getBlogPost, { slug: slug || '' });

  if (post === undefined) {
    return <div className="pt-28 min-h-screen"><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></div>;
  }

  if (!post) {
    return (
      <div className="pt-28 text-center py-20">
        <h1 className="font-heading text-3xl font-bold text-primary mb-4">Article Not Found</h1>
        <Link to="/resources"><Button variant="primary">Back to Resources</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/resources" className="hover:text-white transition-colors">Resources</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{post.title}</span>
          </div>
          <Badge variant="accent" size="sm" className="mb-4">{post.category}</Badge>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readingTime} min read</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </motion.div>
      </Section>

      <Section>
        <article className="max-w-3xl mx-auto">
          <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border">
              <Tag className="w-4 h-4 text-text-muted" />
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-section text-xs font-semibold text-text-secondary capitalize">{tag}</span>
              ))}
            </div>
          )}
        </article>
      </Section>

      <Section variant="section" className="text-center">
        <Link to="/resources">
          <Button variant="outline"><ArrowLeft className="w-4 h-4" /> Back to Resources</Button>
        </Link>
      </Section>
    </div>
  );
}
