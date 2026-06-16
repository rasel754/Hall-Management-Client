import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { studentService, Notice } from "@/services/student.service";
import { Loader2, Bell, Calendar, User, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [readerNotice, setReaderNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await studentService.getNotices();
        setNotices(res.data || res || []);
      } catch (err) {
        console.error("Failed to load notices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Filter Logic
  const filteredNotices = useMemo(() => {
    if (!selectedCategory || selectedCategory === "ALL") return notices;
    return notices.filter(
      (n) => String(n.priority || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [notices, selectedCategory]);

  const categories = [
    { label: "All Notices", value: "ALL" },
    { label: "Urgent Board", value: "urgent" },
    { label: "Maintenance", value: "medium" }, // maps to medium/low priorities in notice schemas
    { label: "General Updates", value: "low" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Check Notice Board"
        subtitle="Stay updated with official residence hall circulars, sports schedules, and academic updates."
      />

      {/* Categories panel */}
      <div className="flex gap-2 flex-wrap pb-2 border-b border-border">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
            className="rounded-lg text-xs"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-12"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></Card>
        </div>
      ) : filteredNotices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices found"
          description="There are currently no announcements posted under this priority category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((n) => {
            const authorName = n.createdBy
              ? `${n.createdBy.firstName} ${n.createdBy.lastName}`
              : "Hall Provost Office";
            return (
              <Card
                key={n._id || n.id}
                className="border-border bg-card shadow-md rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <StatusBadge status={n.priority === "urgent" ? "rejected" : n.priority === "high" ? "warning" : "general"} />
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {n.content}
                    </p>
                  </div>
                </CardContent>

                <div className="p-6 pt-0 border-t border-border/50 flex items-center justify-between mt-4">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
                    <User className="h-3 w-3" />
                    {authorName}
                  </span>
                  <Button
                    onClick={() => setReaderNotice(n)}
                    variant="ghost"
                    size="sm"
                    className="text-primary text-xs hover:bg-primary/5 font-semibold h-8 rounded-lg px-2"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Read More
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reader Dialog Modal */}
      {readerNotice && (
        <Dialog open={!!readerNotice} onOpenChange={(open) => !open && setReaderNotice(null)}>
          <DialogContent className="sm:max-w-[550px] rounded-xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <StatusBadge status={readerNotice.priority === "urgent" ? "rejected" : readerNotice.priority === "high" ? "warning" : "general"} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(readerNotice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-foreground leading-tight">
                {readerNotice.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5 font-semibold">
                <User className="h-3.5 w-3.5" />
                Published by: {readerNotice.createdBy ? `${readerNotice.createdBy.firstName} ${readerNotice.createdBy.lastName}` : "Warden Administration"}
              </DialogDescription>
            </DialogHeader>

            <div className="my-6 max-h-[300px] overflow-y-auto pr-2">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {readerNotice.content}
              </p>
            </div>

            <DialogFooter>
              <Button onClick={() => setReaderNotice(null)} className="rounded-lg text-xs font-semibold h-9">
                Close Notice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
