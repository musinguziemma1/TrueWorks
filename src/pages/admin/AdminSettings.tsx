import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function AdminSettings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-text-muted">Manage your store configuration</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-lg border border-border bg-white">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">General Settings</h2>
            <div className="space-y-4">
              <Input label="Store Name" defaultValue="TrueWorks Limited" />
              <Input label="Tagline" defaultValue="Building Better Organizations" />
              <Input label="Support Email" defaultValue="hello@trueworks.ug" />
              <Input label="Support Phone" defaultValue="+256 700 123 456" />
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-white">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">Payment Gateways</h2>
            <div className="space-y-3">
              {[
                { name: 'MTN Mobile Money', connected: true },
                { name: 'Airtel Money', connected: true },
                { name: 'Flutterwave', connected: false },
                { name: 'Visa / Mastercard', connected: true },
              ].map((gw) => (
                <div key={gw.name} className="flex items-center justify-between p-3 rounded-md bg-section">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${gw.connected ? 'bg-success' : 'bg-text-muted'}`} />
                    <span className="text-sm font-medium text-primary">{gw.name}</span>
                  </div>
                  <span className={`text-xs font-semibold ${gw.connected ? 'text-success' : 'text-text-muted'}`}>
                    {gw.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-border bg-white">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">Store Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Store Status</span>
                <span className="text-sm font-semibold text-success flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Maintenance Mode</span>
                <span className="text-sm text-text-muted">Off</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Version</span>
                <span className="text-sm font-mono text-text-muted">1.0.0</span>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-white">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" size="sm" fullWidth>Clear Cache</Button>
              <Button variant="outline" size="sm" fullWidth>Generate Backup</Button>
              <Button variant="outline" size="sm" fullWidth>View System Logs</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
