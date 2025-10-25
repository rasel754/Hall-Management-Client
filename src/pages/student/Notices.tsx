import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockNotices } from "@/data/notices";
import { Bell, AlertCircle, Calendar, Wrench } from "lucide-react";

const Notices = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "urgent":
        return <AlertCircle className="h-5 w-5" />;
      case "event":
        return <Calendar className="h-5 w-5" />;
      case "maintenance":
        return <Wrench className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "urgent":
        return "destructive";
      case "event":
        return "default";
      case "maintenance":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notice Board</h1>
        <p className="text-muted-foreground mt-2">Stay updated with important announcements</p>
      </div>

      {mockNotices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Notices</h3>
            <p className="text-muted-foreground">There are no notices at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockNotices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(notice.category)}
                      <CardTitle>{notice.title}</CardTitle>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>By {notice.author}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={getCategoryColor(notice.category) as any}>{notice.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground mb-3">{notice.content}</p>
                {notice.expiresAt && (
                  <div className="text-xs text-muted-foreground">
                    Valid until {new Date(notice.expiresAt).toLocaleDateString()}
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
