import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

const MakeNotice = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminService.createNotice(formData);
      if (response.success) {
        toast.success("Notice published successfully", {
          description: response.message || "All students will be notified about this announcement.",
        });
        setFormData({ title: "", content: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish notice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Make Notice</h1>
        <p className="text-muted-foreground mt-2">Create and publish announcements for students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Notice</CardTitle>
          <CardDescription>Fill in the details to publish a new notice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Notice Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a clear and concise title"
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Notice Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Provide detailed information about the notice..."
                rows={6}
                required
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                Be specific and include all relevant details students need to know.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Preview</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">{formData.title || "Notice title will appear here"}</p>
                <p className="text-xs text-muted-foreground">
                  {formData.content || "Notice content will appear here..."}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publish Notice
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ title: "", content: "" })}
                disabled={submitting}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeNotice;
