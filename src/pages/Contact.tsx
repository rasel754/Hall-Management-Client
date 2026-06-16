import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    try {
      // Simulate API submit
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We will get back to you soon.");
      reset();
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have questions about room assignments, billing, or maintenance? Send us a message or visit our office.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Details */}
          <div className="space-y-6">
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Office Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Office Address</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Main Administration Building, Hall Ground Floor<br />
                      University Central Campus, Room 102
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Phone Number</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Email Address</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">support@hallms-university.edu</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">Working Hours</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Monday – Friday: 9:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Map Placeholder */}
            <Card className="border-border bg-card shadow-md rounded-xl overflow-hidden h-64">
              <div className="w-full h-full bg-muted flex items-center justify-center flex-col p-4 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground animate-bounce mb-2" />
                <span className="font-semibold text-sm text-foreground">Interactive Campus Map</span>
                <span className="text-xs text-muted-foreground mt-1">
                  100 University Ave, Campus Town
                </span>
                <div className="mt-4 w-3/4 h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 rounded-full" />
                </div>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name</Label>
                      <Input
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className={errors.name ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                        aria-label="Your full name"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="john.doe@university.edu"
                        {...register("email")}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                        aria-label="Your email address"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="Room assignment inquiry"
                      {...register("subject")}
                      className={errors.subject ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      aria-label="Subject of your message"
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Describe your inquiry in detail..."
                      rows={5}
                      {...register("message")}
                      className={errors.message ? "border-destructive focus-visible:ring-destructive rounded-lg" : "rounded-lg"}
                      aria-label="Content of your message"
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full sm:w-auto h-10 px-6 rounded-lg font-semibold">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
