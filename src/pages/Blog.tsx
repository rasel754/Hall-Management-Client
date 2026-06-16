import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const posts = [
    {
      id: 1,
      title: "Optimizing Your Shared Space: Roommate Coexistence Guide",
      date: "June 14, 2026",
      author: "Office of Student Affairs",
      category: "Tips & Guides",
      excerpt: "Living with a roommate can be one of the best experiences of your university life, but it requires cooperation, communication, and clear boundary setting.",
      content: "Shared university living teaches essential compromise skills. To build a solid connection, we recommend creating a Roommate Agreement in your first week. Discuss sleep schedules, sharing policies (who buys milk?), and clean-up duties. Keep communications direct and friendly to prevent passive-aggressive sticky notes. Finally, respect personal boundaries and allow each other private quiet hours."
    },
    {
      id: 2,
      title: "Vanguard Hall Renovation & Energy Efficiency Plan",
      date: "May 28, 2026",
      author: "Facilities Team",
      category: "Announcements",
      excerpt: "Starting next month, Vanguard Hall will undergo secondary phase window updates to support campus net-zero green emissions standards.",
      content: "Vanguard Hall is our pilot building for sustainable campus transformations. This phase includes installing triple-glazed insulated window frames and energy-efficient digital heat pumps. Work is scheduled by floor to prevent disruptions. Thank you for cooperation as we build a green campus!"
    },
    {
      id: 3,
      title: "Healthy Dining: Hall Cooking Hacks for Busy Semesters",
      date: "May 10, 2026",
      author: "Nutrition Services",
      category: "Lifestyle",
      excerpt: "Nourishing your body shouldn't take three hours of cooking. Try these easy meal-prep recipes designed specifically for residence hall kitchens.",
      content: "Between exams and classes, cooking often drops off the priority list. However, eating instant noodles every night is a recipe for brain fog. We've compiled 5 recipes that require less than 15 minutes of active cooking. Tips include freezing customized single-portion pasta sauces, investing in a reliable rice cooker, and setting up batch grains over the weekend."
    },
    {
      id: 4,
      title: "Annual Sports Week Tournament Schedules & Teams",
      date: "April 18, 2026",
      author: "Hall Sports Council",
      category: "Events",
      excerpt: "Registrations are officially open for this year's Inter-Hall Championship. Sign up for volleyball, basketball, or chess tournaments now.",
      content: "The annual sports showdown is back! Matches will take place at the campus sports dome, with the final trophy ceremony on Saturday night. Team captains must register by the end of the month. Make sure to claim your hall-branded sports jersey at registration!"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Hall Blog & News</h1>
          <p className="mt-4 text-muted-foreground">
            Stay up to date with the latest hall updates, campus living tips, and student activity spotlights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="border-border bg-card shadow-md rounded-xl flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow">
              <div>
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary/10 text-primary font-semibold border-primary/20 hover:bg-primary/20">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground leading-tight hover:text-primary cursor-pointer transition-colors" onClick={() => setSelectedPost(post)}>
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1 mt-1 text-muted-foreground/80">
                    <User className="h-3.5 w-3.5" />
                    By {post.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </div>
              <div className="p-6 pt-0 mt-4">
                <Button
                  variant="link"
                  onClick={() => setSelectedPost(post)}
                  className="p-0 text-primary font-bold hover:underline flex items-center gap-1.5"
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal reader */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="sm:max-w-[600px] rounded-xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/15 text-primary border-primary/20">{selectedPost.category}</Badge>
                <span className="text-xs text-muted-foreground">{selectedPost.date}</span>
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">{selectedPost.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <User className="h-3.5 w-3.5" />
                Authored by {selectedPost.author}
              </DialogDescription>
            </DialogHeader>
            <div className="my-6">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedPost(null)} className="rounded-lg">
                Close Article
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
