import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Loader2, ShieldCheck, Mail, Database, Wrench } from "lucide-react";

const settingsSchema = z.object({
  maxCapacity: z.coerce.number().min(10, "Minimum total capacity must be at least 10").max(5000, "Maximum total capacity limit is 5000"),
  systemEmail: z.string().email("Please enter a valid administrative email address"),
  backupInterval: z.string().min(1, "Select a backup interval frequency"),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [systemLive, setSystemLive] = useState(true);
  const [allowPublicRegistrations, setAllowPublicRegistrations] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      maxCapacity: 1200,
      systemEmail: "admin.hallms@university.edu",
      backupInterval: "daily",
    }
  });

  const onSubmit = async (data: SettingsValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Administrative parameters updated successfully!");
    } catch (err) {
      toast.error("Failed to save configuration settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        subtitle="Manage global capacity ceilings, student email notifications, db backup patterns, and platform statuses."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* General Operational Limits */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader className="flex flex-row items-center gap-3 bg-muted/10 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Operational Constraints</CardTitle>
                <CardDescription>Eviction buffers & seat capacity caps</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">System Capacity Threshold</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  placeholder="1200"
                  {...register("maxCapacity")}
                  className={errors.maxCapacity ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  aria-label="System capacity limit"
                />
                {errors.maxCapacity && (
                  <p className="text-xs text-destructive">{errors.maxCapacity.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border mt-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Allow Student Self-Registration</Label>
                  <p className="text-xs text-muted-foreground">Students can register accounts at /register</p>
                </div>
                <Switch
                  checked={allowPublicRegistrations}
                  onCheckedChange={setAllowPublicRegistrations}
                  aria-label="Toggle student self registration availability"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email notifications */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader className="flex flex-row items-center gap-3 bg-muted/10 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">SMTP Notification Routing</CardTitle>
                <CardDescription>Support invoice notifications</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="systemEmail">Administrative Email Address</Label>
                <Input
                  id="systemEmail"
                  type="email"
                  placeholder="admin.hallms@university.edu"
                  {...register("systemEmail")}
                  className={errors.systemEmail ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  aria-label="System support routing email address"
                />
                {errors.systemEmail && (
                  <p className="text-xs text-destructive">{errors.systemEmail.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Database Backup configuration */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader className="flex flex-row items-center gap-3 bg-muted/10 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Database Backup frequency</CardTitle>
                <CardDescription>Server snapshot configuration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="backupInterval">Backup Snapshot Frequency</Label>
                <Select
                  value={watch("backupInterval")}
                  onValueChange={(val) => setValue("backupInterval", val)}
                >
                  <SelectTrigger id="backupInterval" className="w-full bg-card rounded-lg h-10 border-border">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly Snapshots</SelectItem>
                    <SelectItem value="daily">Daily Cron Backups</SelectItem>
                    <SelectItem value="weekly">Weekly Redundancy Syncs</SelectItem>
                    <SelectItem value="monthly">Monthly Cold Archiving</SelectItem>
                  </SelectContent>
                </Select>
                {errors.backupInterval && (
                  <p className="text-xs text-destructive">{errors.backupInterval.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Mode Toggle */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader className="flex flex-row items-center gap-3 bg-muted/10 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Operational Mode Status</CardTitle>
                <CardDescription>Put platform into maintenance lockouts</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Platform Operation Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    {systemLive
                      ? "System online. Student & Admin pages fully functional."
                      : "Maintenance Mode. Students are locked out with static screen."}
                  </p>
                </div>
                <Switch
                  checked={systemLive}
                  onCheckedChange={setSystemLive}
                  aria-label="Toggle system live status"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading} className="rounded-lg h-10 px-6 font-semibold flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
