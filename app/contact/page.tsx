'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Navbar } from '@/components/navbar'; // <-- added navbar

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        {/* HERO */}
        <div className="relative overflow-hidden">
          {/* added top padding so hero content doesn't stick to navbar */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-700 to-sky-600 text-white pt-28 md:pt-32 pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
              <div className="absolute -top-20 -left-20 w-56 h-56 bg-blue-400/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-indigo-500/20 blur-3xl rounded-full" />

              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
                Ready to start your next project? Get in touch with our team for a quote or consultation.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg ring-1 ring-slate-100">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-2xl font-semibold">Send Us a Message</CardTitle>
                  <CardDescription className="text-slate-600">
                    Fill out the form below and we’ll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Smith"
                          className="w-full bg-white/90"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@company.com"
                          className="w-full bg-white/90"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                          className="w-full bg-white/90"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                          className="w-full bg-white/90"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your project requirements..."
                        rows={6}
                        className="w-full resize-none bg-white/90"
                      />
                    </div>

                    {/* Status messages */}
                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
                        Thank you — we received your message and will reply soon.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                        Oops — something went wrong. Please try again or email us directly.
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-indigo-600 hover:to-sky-500 text-white px-6 py-3 rounded-xl shadow-lg"
                      >
                        {isSubmitting ? 'Sending...' : (
                          <span className="flex items-center">
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>

                      <div className="mt-3 md:mt-0 text-sm text-slate-600">
                        Or email us directly at{' '}
                        <a href="mailto:info@precisionmfg.com" className="text-slate-900 font-medium hover:underline">
                          info@OpenManufacturing.com
                        </a>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="shadow-sm ring-1 ring-slate-100">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">Address</div>
                      <div className="text-sm text-slate-600 mt-1">
                        123 Industrial Parkway<br />
                        Manufacturing District<br />
                        Boston, MA 02101
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">Phone</div>
                      <div className="text-sm text-slate-600 mt-1">(555) 123-4567</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-900">Email</div>
                      <div className="text-sm text-slate-600 mt-1">info@OpenManufacturing.com</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="shadow-sm ring-1 ring-slate-100">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-lg font-semibold">Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Saturday</span>
                    <span className="font-medium">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="shadow-sm ring-1 ring-slate-100 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-white flex flex-col items-center justify-center">
                    {/* Replace with real map iframe / next/image when available */}
                    <div className="text-center text-slate-600 px-6">
                      <MapPin className="h-12 w-12 mx-auto mb-3 text-sky-600" />
                      <div className="text-sm font-medium">Our Facility</div>
                      <div className="text-xs text-slate-500 mt-1">Boston, MA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
