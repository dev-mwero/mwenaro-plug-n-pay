import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-premium">Settings</h1>
        <p className="text-gray-500">Manage your account and integration preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input disabled value={session?.user?.name || ""} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled value={session?.user?.email || ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
          <CardDescription>Where M-Pesa callbacks will be sent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Live Webhook URL</Label>
            <Input placeholder="https://yourdomain.com/webhooks/mpesa" />
          </div>
           <div className="space-y-2">
            <Label>Sandbox Webhook URL</Label>
            <Input placeholder="https://test.yourdomain.com/webhooks/mpesa" />
          </div>
          <Button disabled className="mt-4">Save Configuration</Button>
          <p className="text-xs text-muted-foreground mt-2">Webhook configuration is coming soon in the next release.</p>
        </CardContent>
      </Card>
    </div>
  );
}
