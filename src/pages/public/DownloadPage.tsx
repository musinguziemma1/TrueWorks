import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { CheckCircle, XCircle, Download, Loader2 } from 'lucide-react';

export function DownloadPage() {
  const [searchParams] = useSearchParams();
  const downloadId = searchParams.get('id');
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const [downloadInfo, setDownloadInfo] = useState<any>(null);
  const [validating, setValidating] = useState(true);
  const validateDownload = useMutation(api.downloads.validate);
  const recordDownload = useMutation(api.downloads.recordDownload);

  useEffect(() => {
    if (!downloadId) return;
    setValidating(true);
    validateDownload({ downloadId: downloadId as any })
      .then(setDownloadInfo)
      .finally(() => setValidating(false));
  }, [downloadId, validateDownload]);

  const handleDownload = async () => {
    if (!downloadId || !downloadInfo?.valid) return;

    setDownloading(true);
    try {
      await recordDownload({ downloadId: downloadId as any });
      // In production, this would trigger an actual file download
      // For now, we just show success
      setDownloadComplete(true);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (!downloadId) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-primary mb-2">Invalid Download Link</h1>
          <p className="text-text-secondary mb-6">No download ID provided. Please check your email for the correct download link.</p>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-text-secondary">Validating download link...</p>
        </div>
      </div>
    );
  }

  if (!downloadInfo.valid) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-primary mb-2">Download Unavailable</h1>
          <p className="text-text-secondary mb-6">{downloadInfo.reason}</p>
          <Link to="/store">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (downloadComplete) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-primary mb-2">Download Started</h1>
          <p className="text-text-secondary mb-2">Your file is being downloaded.</p>
          <p className="text-sm text-text-muted mb-6">
            Remaining downloads: {downloadInfo.download.remainingDownloads - 1}
          </p>
          <Link to="/store">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
          <Download className="w-10 h-10 text-accent" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-primary mb-2">
          {downloadInfo.download.productName}
        </h1>
        <p className="text-text-secondary mb-2">Your download is ready</p>
        <p className="text-sm text-text-muted mb-6">
          {downloadInfo.download.remainingDownloads} downloads remaining. Expires{' '}
          {new Date(downloadInfo.download.expiryDate).toLocaleDateString()}
        </p>
        <Button
          variant="accent"
          size="lg"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Preparing Download...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download Now
            </>
          )}
        </Button>
        <p className="text-xs text-text-muted mt-4">
          Files: {downloadInfo.download.files.join(', ')}
        </p>
      </div>
    </div>
  );
}
