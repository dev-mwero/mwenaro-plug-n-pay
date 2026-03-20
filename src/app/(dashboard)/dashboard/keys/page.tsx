import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export default function KeysPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
        <p className="text-gray-500">Manage your credentials and integrate PlugPay into your application.</p>
      </div>

      <ApiKeyManager />
    </div>
  );
}
