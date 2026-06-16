import React from "react";
import { motion } from "framer-motion";
import { Building2, Award, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const team = [
    { name: "Dr. Arthur Pendelton", role: "Provost & Chair", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { name: "Sarah Jenkins", role: "Hall Warden", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
    { name: "Marcus Brody", role: "Senior administrator", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    { name: "Elena Rostova", role: "Operations Lead", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            About <span className="text-primary">HallMS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Providing safe, vibrant, and study-focused living spaces that foster personal growth and academic excellence at our university.
          </motion.p>
        </div>

        {/* Stats / Core Values */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-20">
          {[
            { icon: Building2, title: "Modern Facilities", desc: "Equipped with high-speed internet, research lounges, and laundry hubs." },
            { icon: Users, title: "Rich Community", desc: "A home to over 2,500 diverse students participating in hall clubs and teams." },
            { icon: Award, title: "Academic Focus", desc: "Dedicated quiet spaces and peer tutoring programs to push academic limits." },
            { icon: Heart, title: "Secure Living", desc: "24/7 gate security, electronic room entry, and mental-wellness resources." }
          ].map((v, i) => (
            <Card key={i} className="border-border bg-card shadow-md rounded-xl hover:-translate-y-1 transition-transform">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-4">Meet Our Administration</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-10 text-sm">
            Our dedicated team is here to support student well-being and run administrative tasks smoothly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-block mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-28 h-28 rounded-full object-cover border-4 border-card shadow-md mx-auto"
                  />
                  <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mt-1">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
