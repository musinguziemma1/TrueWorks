import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center">
          <Search className="w-12 h-12 text-primary/30" />
        </div>
        <h1 className="font-heading text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-xl text-text-secondary mb-2">Page not found</p>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
