import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentService, Notice } from "@/services/student.service";
import { Bell, Loader2, AlertCircle, User } from "lucide-react";
import { toast } from "sonner";

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const response = await studentService.getNotices();


      if (response.success || response) {
        // Handle various response structures:
        // 1. response.data.notices (standard)
        // 2. response.notices (direct)
        // 3. response.data (array directly in data)
        const rawNotices = response.data?.notices || response.notices || response.data || [];



        // Filter only active notices intended for students
        const activeNotices = Array.isArray(rawNotices)
          ? rawNotices.filter((notice: Notice) => {
            const isTargetingStudent = notice.targetAudience?.includes('student');
            const isActive = notice.isActive;
            return isActive && isTargetingStudent;
          })
          : [];


        setNotices(activeNotices);
      }
    } catch (error: any) {
      console.error("❌ Error loading notices:", error);
      toast.error("Failed to Load Notices", {
        description: error.response?.data?.message || "Unable to fetch notices at this time.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-l-red-500';
      case 'high': return 'border-l-4 border-l-orange-500';
      case 'medium': return 'border-l-4 border-l-blue-500';
      case 'low': return 'border-l-4 border-l-gray-400';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notice Board</h1>
        <p className="text-muted-foreground mt-2">Stay updated with important announcements</p>
      </div>

      {notices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Notices</h3>
            <p className="text-muted-foreground">There are no active notices at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <Card
              key={notice._id || notice.id}
              className={`hover:shadow-md transition-shadow ${getPriorityColor(notice.priority)}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{notice.title}</CardTitle>
                      <Badge variant={getPriorityVariant(notice.priority)} className="uppercase text-xs">
                        {notice.priority}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span>{formatDate(notice.createdAt)}</span>
                      {notice.createdBy && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {notice.createdBy.firstName} {notice.createdBy.lastName}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {notice.content}
                </p>
                {notice.targetAudience && notice.targetAudience.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Target Audience: {notice.targetAudience.map(a =>
                        a.charAt(0).toUpperCase() + a.slice(1)
                      ).join(', ')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
