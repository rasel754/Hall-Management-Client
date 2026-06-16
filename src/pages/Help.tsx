import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HelpCircle, MessageSquareCode, Loader2 } from "lucide-react";

const ticketSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function Help() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = async (data: TicketFormValues) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("Support ticket submitted! Ticket number: #HMS-" + Math.floor(1000 + Math.random() * 9000));
      reset();
    } catch (err) {
      toast.error("Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "How do I book a room inside a residence hall?",
      a: "Login to your student account, navigate to 'Hall Booking' on the sidebar, search and filter for vacant rooms, click 'Book Now' and fill out your move-in start date. Note that bookings are requests that must be approved by the admin office before you can move in."
    },
    {
      q: "How can I request a seat cancellation?",
      a: "Go to your student dashboard, navigate to 'Cancel Seat', select a reason from the dropdown, fill in details of your checkout date, and confirm your request. Once confirmed, this cancels your booking immediately."
    },
    {
      q: "Where do I report maintenance complaints (e.g. broken tap)?",
      a: "Go to 'My Complaints' on the student portal sidebar, click 'New Complaint', select the category (e.g., Maintenance, Cleaning, Security), write details, and submit. Admins will review, assign staff, and mark the ticket as Resolved when fixed."
    },
    {
      q: "What is the procedure for monthly rent payment?",
      a: "On your student dashboard, click on 'Payment'. You will see summary statistics and a list of pending monthly rents. Click 'Pay Now' on any pending month to launch the card payment simulator, enter details, and execute."
    },
    {
      q: "Can I choose my roommates?",
      a: "During the room booking process, you can mention roommate preferences in the 'Remarks' text input. Admin staff review remarks before allocating rooms, though allocations depend on capacity."
    },
    {
      q: "How do I update my profile details?",
      a: "Go to 'Profile Settings' under student portal dashboard, edit details like your phone number or emergency contact, upload a custom avatar, and click 'Save Changes'."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-2">
            <HelpCircle className="h-9 w-9 text-primary" />
            Help Center
          </h1>
          <p className="mt-4 text-muted-foreground">
            Search our frequently asked questions or launch a support ticket for customized assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
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

          {/* Support Form Card */}
          <div className="lg:col-span-5">
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader className="flex flex-row items-center gap-3 bg-muted/10 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MessageSquareCode className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Submit a Support Ticket</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Response time: &lt; 24 hours</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket-email">Your Email</Label>
                    <Input
                      id="ticket-email"
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

                  <div className="space-y-2">
                    <Label htmlFor="ticket-subject">Subject</Label>
                    <Input
                      id="ticket-subject"
                      type="text"
                      placeholder="Account access problem"
                      {...register("subject")}
                      className={errors.subject ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      aria-label="Subject of the support ticket"
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket-desc">Description of issue</Label>
                    <Textarea
                      id="ticket-desc"
                      placeholder="Explain what happened and list error codes if any..."
                      rows={4}
                      {...register("description")}
                      className={errors.description ? "border-destructive focus-visible:ring-destructive rounded-lg" : "rounded-lg"}
                      aria-label="Description of the issue"
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full h-10 rounded-lg font-semibold">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Ticket...
                      </>
                    ) : (
                      "Submit Support Ticket"
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
