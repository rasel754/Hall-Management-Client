import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building2,
  Users,
  Shield,
  Zap,
  Star,
  Bell,
  HelpCircle,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  DoorOpen,
  Calendar,
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { studentService } from "@/services/student.service";
import { SkeletonCard } from "@/components/ui/skeleton-custom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Landing() {
  const navigate = useNavigate();
  const { token, role, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Live Stats Counter states
  const [studentsHoused, setStudentsHoused] = useState(0);
  const [roomsAvailable, setRoomsAvailable] = useState(0);
  const [satisfactionRate, setSatisfactionRate] = useState(0);

  // Trigger statistics counters increments
  useEffect(() => {
    if (studentsHoused < 2500) {
      const interval = setInterval(() => {
        setStudentsHoused((prev) => Math.min(prev + 50, 2500));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [studentsHoused]);

  useEffect(() => {
    if (roomsAvailable < 184) {
      const interval = setInterval(() => {
        setRoomsAvailable((prev) => Math.min(prev + 4, 184));
      }, 25);
      return () => clearInterval(interval);
    }
  }, [roomsAvailable]);

  useEffect(() => {
    if (satisfactionRate < 98) {
      const interval = setInterval(() => {
        setSatisfactionRate((prev) => Math.min(prev + 2, 98));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [satisfactionRate]);

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await studentService.getAllRooms();
        const data = res.data || res || [];
        setRooms(data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching landing preview rooms:", err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you! You are now subscribed to HallMS notifications.");
    setNewsletterEmail("");
  };

  const seedRooms = [
    { id: "s1", roomNumber: "102", type: "Single", capacity: 1, price: 3500 },
    { id: "s2", roomNumber: "205", type: "Double", capacity: 2, price: 2200 },
    { id: "s3", roomNumber: "304", type: "Double", capacity: 2, price: 2200 },
    { id: "s4", roomNumber: "408", type: "Triple", capacity: 3, price: 1600 },
  ];

  const previewRooms = rooms.length > 0 ? rooms : seedRooms;

  const testimonials = [
    {
      name: "Marcus Aurelius",
      dept: "Philosophy, Year 3",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      quote: "Managing my room bookings and filing maintenance issues has never been this simple. The Emerald Hall staff solved my radiator leak in under two hours!"
    },
    {
      name: "Juliet Capulet",
      dept: "Literature, Year 2",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      quote: "The payment reminders and digital receipt downloads helped me keep track of expenses. The dashboard interface is absolutely clean and responsive."
    },
    {
      name: "Arthur Dent",
      dept: "Astrophysics, Year 1",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      quote: "Transitioning to campus living was seamless. I booked a double room online, got warden approval on Tuesday, and moved in by Friday morning."
    }
  ];

  const latestNotices = [
    { title: "Renovation and Window Updates: Vanguard Hall", date: "June 14, 2026", cat: "Maintenance", excerpt: "Starting July 1st, secondary window frames will be replaced for environmental energy savings..." },
    { title: "Inter-Hall Volleyball Championship Registrations", date: "June 10, 2026", cat: "Events", excerpt: "Sign up at the sports council office. Registrations close by the end of the semester..." },
    { title: "Summer Accommodation & Seat Extensions", date: "June 05, 2026", cat: "Academic", excerpt: "Students wishing to occupy rooms during the summer term must file extensions through their portal..." }
  ];

  const faqs = [
    { q: "How does the room booking workflow function?", a: "Once you register and log in, go to the booking page. Filter rooms by floor and type. Select a room and submit a booking with your desired move-in date. A warden will review and approve it." },
    { q: "Can I cancel my seat allocation mid-semester?", a: "Yes, you can file a checkout petition in the 'Cancel Seat' tab. Once submitted, your room contract will terminate according to university housing guidelines." },
    { q: "What should I do if my room has a maintenance issue?", a: "Create a support ticket under the 'My Complaints' section on the student portal. You can choose category, explain the issue, and wardens will assign mechanics." },
    { q: "Is payment information secure?", a: "Absolutely. Rents are processed through encrypted card processors. Your invoices, receipts, and history are logged securely inside your student portal." },
    { q: "Can I choose my roommates?", a: "During the room booking application, you can specify roommate preferences in the remarks area. We will make every effort to allocate rooms accordingly." },
    { q: "What happens if I forget my login password?", a: "You can click on the 'Forgot Password' link on the login page to initiate password recovery, or contact student support offices." }
  ];

  const getInitials = (n: string) => n.split(" ").map((x) => x[0]).join("").toUpperCase();

  const heroHeadlineWords = "Premium Student Living Simplified".split(" ");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 glassmorphism shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              HallMS
            </span>
          </Link>

          {/* Desktop Routes */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/blog" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Blog</Link>
            <Link to="/help" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Help</Link>
            <Link to="/contact" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-foreground hover:bg-muted/50">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-amber-400" />}
            </Button>

            {token ? (
              <div className="flex items-center gap-3">
                <Button onClick={() => navigate(role === "student" ? "/dashboard/student/overview" : "/dashboard/admin/overview")} className="rounded-lg h-9 text-xs font-semibold px-4">
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-xl bg-card border-border shadow-lg" align="end">
                    <DropdownMenuLabel className="font-semibold p-4 text-foreground">
                      {user?.name || "User Portal"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(role === "student" ? "/dashboard/student/my-room" : "/dashboard/admin/halls")} className="p-3 cursor-pointer text-sm gap-2">
                      <DoorOpen className="h-4 w-4" />
                      My Room
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(role === "student" ? "/dashboard/student/profile" : "/dashboard/admin/settings")} className="p-3 cursor-pointer text-sm gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="p-3 cursor-pointer text-sm text-destructive gap-2 hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button onClick={() => navigate("/login")} className="rounded-lg h-9 text-xs font-semibold px-5">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-foreground">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-amber-400" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3 flex flex-col">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold p-2 rounded-md hover:bg-muted">Home</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold p-2 rounded-md hover:bg-muted">About</Link>
                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold p-2 rounded-md hover:bg-muted">Blog</Link>
                <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold p-2 rounded-md hover:bg-muted">Help</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold p-2 rounded-md hover:bg-muted">Contact</Link>
                <div className="border-t border-border pt-3">
                  {token ? (
                    <div className="space-y-2">
                      <Button onClick={() => { setMobileMenuOpen(false); navigate(role === "student" ? "/dashboard/student/overview" : "/dashboard/admin/overview"); }} className="w-full rounded-lg h-10 font-semibold">
                        Dashboard
                      </Button>
                      <Button onClick={() => { setMobileMenuOpen(false); logout(); }} variant="outline" className="w-full text-destructive rounded-lg h-10 font-semibold border-destructive/20 hover:bg-destructive/5">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => { setMobileMenuOpen(false); navigate("/login"); }} className="w-full rounded-lg h-10 font-semibold">
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:py-36 overflow-hidden flex items-center min-h-[70vh] bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none text-foreground">
              {heroHeadlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className={i === 2 ? "inline-block text-primary mx-1" : "inline-block mx-1"}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Configure rooms, schedule billings, resolve maintenance tickets, and check notices on a SaaS-grade university hall portal.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button onClick={() => navigate(token ? (role === "student" ? "/dashboard/student/hall-booking" : "/dashboard/admin/overview") : "/login")} size="lg" className="rounded-lg text-sm px-8 py-6 font-bold shadow-lg shadow-primary/20 hover:shadow-xl w-full sm:w-auto">
                Book Your Room
              </Button>
              <Button onClick={() => navigate("/about")} variant="ghost" size="lg" className="rounded-lg text-sm px-8 py-6 font-bold text-foreground hover:bg-muted/50 w-full sm:w-auto">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Animated backdrop mesh elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-pulse -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl animate-pulse -z-10" />
      </section>

      {/* SECTIONS */}

      {/* 1. Stats Counter Section */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: `${studentsHoused}+`, title: "Students Housed", sub: "Vibrant campus community" },
              { val: roomsAvailable, title: "Rooms Available", sub: "Vacant seats ready" },
              { val: `${satisfactionRate}%`, title: "Satisfaction Rate", sub: "Based on survey statistics" },
              { val: "15+", title: "Years Running", sub: "Reliable accommodation" }
            ].map((s, idx) => (
              <div key={idx} className="text-center space-y-1">
                <div className="text-3xl md:text-5xl font-extrabold text-primary">{s.val}</div>
                <div className="text-sm font-bold text-foreground">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">Platform Features</h2>
          <p className="mt-4 text-muted-foreground text-sm">
            Everything administrators and students need to communicate, book rooms, and schedule repairs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: DoorOpen, title: "Seamless Room Booking", desc: "Browse vacant spaces by floor configurations and capacities, then submit requests." },
            { icon: MessageSquare, title: "Complaint Resolutions", desc: "Report water leaks, electronics bugs, or cleaning. Track staff assignments real-time." },
            { icon: Bell, title: "Broadcast Board Board", desc: "Publish urgent maintenance notices, sports schedules, and terminal warnings immediately." },
            { icon: CreditCard, title: "Automated Payments", desc: "Clear monthly room rents via card details, download receipts, and track bills." },
            { icon: Shield, title: "Eviction & Block Settings", desc: "Block misbehaving accounts or edit system limits to maintain hall order." },
            { icon: Zap, title: "Responsive Layouts", desc: "Accessible from anywhere. Manage halls on smartphones, tablets, or laptops." }
          ].map((feat, idx) => (
            <Card key={idx} className="border-border bg-card shadow-md rounded-xl hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit">
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. How It Works Flow */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted-foreground text-sm">A 3-step simple workflow to get you settled into campus halls.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {[
              { step: "01", title: "Apply Online", desc: "Create an account, enter your student ID, search vacancy rooms, and lodge booking reservations." },
              { step: "02", title: "Get Approved", desc: "Warden staff evaluate your request, check space caps, allocate roommates, and approve." },
              { step: "03", title: "Move In", desc: "Download your digital approval allocation slip, pick up room keys at campus desk, and settle in." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 relative">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-extrabold text-lg flex items-center justify-center shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Available Rooms Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Featured Rooms Available</h2>
            <p className="mt-2 text-muted-foreground text-sm">Real-time room listings fetched directly from the database.</p>
          </div>
          <Button onClick={() => navigate(token ? "/dashboard/student/hall-booking" : "/login")} className="rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            Browse All Rooms
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {loadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewRooms.map((r: any) => (
              <Card key={r._id || r.id} className="border-border bg-card shadow-md rounded-xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="h-44 bg-muted flex items-center justify-center relative">
                  <span className="text-4xl text-slate-400">🛏️</span>
                  <span className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Vacant
                  </span>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground">Room {r.roomNumber || r.number}</h3>
                    <p className="text-xs text-muted-foreground">Type: {r.type} Room</p>
                    <p className="text-xs text-muted-foreground">Capacity limit: {r.capacity} students</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-extrabold text-primary">${r.price || 2000}/mo</span>
                    <Button onClick={() => navigate(token ? "/dashboard/student/hall-booking" : "/login")} variant="outline" size="sm" className="rounded-lg text-xs">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 5. Testimonials Carousel */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="flex justify-center text-amber-500 gap-1">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">What Housed Students Say</h2>

          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-lg md:text-xl italic text-muted-foreground leading-relaxed">
                  "{testimonials[testimonialIndex].quote}"
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <img
                    src={testimonials[testimonialIndex].avatar}
                    alt={testimonials[testimonialIndex].name}
                    loading="lazy"
                    className="w-11 h-11 rounded-full object-cover shadow-sm border border-border"
                  />
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-foreground">{testimonials[testimonialIndex].name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonials[testimonialIndex].dept}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTestimonialIndex((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
              className="h-9 w-9 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTestimonialIndex((p) => (p === testimonials.length - 1 ? 0 : p + 1))}
              className="h-9 w-9 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Notices Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Latest Notices</h2>
          <p className="mt-4 text-muted-foreground text-sm">Stay up to date with official residence hall advisories.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNotices.map((n, i) => (
            <Card key={i} className="border-border bg-card shadow-md rounded-xl flex flex-col justify-between hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{n.cat}</span>
                  <span>{n.date}</span>
                </div>
                <h3 className="text-base font-bold text-foreground leading-snug">{n.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.excerpt}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to={token ? "/dashboard/student/notices" : "/login"} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Accordion FAQ Section */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-foreground tracking-tight mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border bg-card rounded-xl px-4 overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="font-bold text-sm text-foreground text-left py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 8. Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-indigo-950 text-primary-foreground relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Stay Updated</h2>
          <p className="text-sm text-primary-foreground/85 max-w-xl mx-auto">
            Subscribe to our newsletter to receive immediate notification alerts regarding room openings, renovation timelines, and sports schedules.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
            <Input
              type="email"
              placeholder="Enter your university email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white h-11 rounded-lg w-full"
              aria-label="Newsletter email input"
            />
            <Button type="submit" variant="secondary" className="h-11 rounded-lg px-6 font-semibold bg-white text-primary hover:bg-slate-100 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-card border-t border-border py-16 text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏫</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                HallMS
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              University residence halls administration portal. Providing room management, complaints, billing logs, and announcements in a single SaaS application.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm">Quick Links</h4>
            <ul className="space-y-2 flex flex-col">
              <li><Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-xs text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/help" className="text-xs text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal Policy */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm">Legal & Policies</h4>
            <ul className="space-y-2 flex flex-col">
              <li><Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm">Campus Contact</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Main Campus, Central Administration Bldg, Office 102<br />
              Email: support@hallms-university.edu<br />
              Phone: +1 (555) 987-6543
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} University Hall Management System (HallMS). All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Facebook</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
