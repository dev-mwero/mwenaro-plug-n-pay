"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff, Key, Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApiKeyManager() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isLiveKey, setIsLiveKey] = useState(false);
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch keys");
      setKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Keys Error:", err);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newKeyName) return;
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName, isLive: isLiveKey }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate API key");
      }

      setNewlyCreatedKey(data.rawKey);
      setKeys([data, ...keys]);
      setNewKeyName("");
    } catch (err: any) {
      console.error("API Key Generation Error:", err);
      // TODO: Add toast notification for error
      alert(err.message || "Something went wrong while generating the key");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setKeys(keys.filter((k) => k._id !== id));
    await fetch("/api/keys?id=" + id, { method: "DELETE" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Create a new API key</CardTitle>
          <CardDescription>
            Use this key to authenticate your requests to the PlugPay API.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="e.g. My Website Production" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              value={isLiveKey ? "true" : "false"}
              onChange={(e) => setIsLiveKey(e.target.value === "true")}
            >
              <option value="false">Sandbox</option>
              <option value="true">Live (Prod)</option>
            </select>
            <Button onClick={handleCreate} disabled={creating || !newKeyName} className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {newlyCreatedKey && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-sm text-amber-800">Save your new API key</CardTitle>
            <CardDescription className="text-amber-700/70">
              For security reasons, this key will only be shown once. Please store it somewhere safe.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <code className="bg-white p-3 rounded border border-amber-200 flex-1 font-mono text-sm break-all">
              {newlyCreatedKey}
            </code>
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(newlyCreatedKey)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setNewlyCreatedKey(null)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 px-1">Your API Keys</h3>
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-200" />
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg border border-dashed text-gray-400">
            No API keys found. Create one to get started.
          </div>
        ) : (
          <div className="grid gap-3">
            {keys.map((key) => (
              <Card key={key._id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-full flex items-center justify-center",
                      key.isLive ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                    )}>
                      <Key className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{key.name}</p>
                      <p className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase break-all">{key.prefix}••••••••</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
                    <div className="text-left sm:text-right mr-0 sm:mr-4">
                      <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold tracking-wider">Status</p>
                      <p className="text-xs text-emerald-600 font-medium">Active</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(key._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
