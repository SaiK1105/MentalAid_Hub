import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, User, Star, MapPin, Home, Video, Phone, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Counsellor {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  experience: number;
  languages: string[];
  availability: any;
  session_types: ("video" | "phone" | "in-person")[];
  bio: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"select-counsellor" | "select-time" | "details" | "confirmation">("select-counsellor");
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState<"video" | "phone" | "in-person">("video");
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    concerns: "",
    urgency: "routine"
  });

  useEffect(() => {
    const fetchCounsellors = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('counsellors').select('*');
      if (error) {
        console.error("Error fetching counsellors:", error);
        toast({ title: "Error", description: "Could not fetch counsellors.", variant: "destructive" });
        setCounsellors([]); // Set to empty array on error
      } else {
        setCounsellors(
          (data || []).map((c) => ({
            ...c,
            session_types: (c.session_types as string[]).filter(
              (type): type is "video" | "phone" | "in-person" =>
                type === "video" || type === "phone" || type === "in-person"
            ),
          }))
        ); // Ensure session_types is correctly typed
      }
      setLoading(false);
    };

    fetchCounsellors();
  }, [toast]);


  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const getSessionIcon = (type: "video" | "phone" | "in-person") => {
    switch (type) {
      case "video": return Video;
      case "phone": return Phone;
      case "in-person": return MapPin;
    }
  };
  
  const formatTimeTo24h = (time12h: string) => {
    if (!time12h) return "00:00:00";
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString().padStart(2, '0');
    }
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const handleBooking = async () => {
    if (!user || !selectedCounsellor || !selectedDate || !selectedTime) {
        toast({ title: "Missing Information", description: "Please complete all steps before confirming.", variant: "destructive"});
        return;
    }

    setLoading(true);

    const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        counsellor_id: selectedCounsellor.id,
        session_type: sessionType,
        session_date: format(selectedDate, "yyyy-MM-dd"),
        session_time: formatTimeTo24h(selectedTime),
        user_name: bookingDetails.name || 'Anonymous',
        user_email: bookingDetails.email,
        user_phone: bookingDetails.phone,
        concerns: bookingDetails.concerns,
        status: 'confirmed'
    });

    setLoading(false);

    if (error) {
        console.error("Error creating booking:", error);
        toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } else {
        setStep("confirmation");
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-2xl mx-auto space-y-6 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full shadow-soft">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your session has been successfully scheduled.
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Counsellor</Label>
                  <p className="text-sm">{selectedCounsellor?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date & Time</Label>
                  <p className="text-sm">
                    {selectedDate && format(selectedDate, "PPP")} at {selectedTime}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Session Type</Label>
                  <div className="flex items-center gap-2 text-sm">
                    {(() => {
                      const IconComponent = getSessionIcon(sessionType);
                      return <IconComponent className="w-4 h-4" />;
                    })()}
                    {sessionType.charAt(0).toUpperCase() + sessionType.slice(1)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Booking ID</Label>
                  <p className="text-sm font-mono">MH-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  A confirmation email will be sent to you shortly with meeting details and preparation instructions.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate("/dashboard")}
                    className="flex-1"
                  >
                    Return to Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setStep("select-counsellor")}
                    className="flex-1"
                  >
                    Book Another Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="p-2"
          >
            <Home className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">{t('booking.title')}</h1>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[
                { key: "select-counsellor", label: "Select Counsellor" },
                { key: "select-time", label: "Choose Time" },
                { key: "details", label: "Your Details" }
              ].map((stepItem, index) => (
                <div key={stepItem.key} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepItem.key 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step === stepItem.key ? "text-primary font-medium" : "text-muted-foreground"
                  }`}>
                    {stepItem.label}
                  </span>
                  {index < 2 && <div className="w-8 h-px bg-border mx-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {step === "select-counsellor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? Array.from({ length: 3 }).map((_, i) => <Card key={i} className="animate-pulse h-96 bg-muted"></Card>) 
            : counsellors.map((counsellor) => (
              <Card 
                key={counsellor.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-card ${
                  selectedCounsellor?.id === counsellor.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCounsellor(counsellor)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-xl">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">{counsellor.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{counsellor.name}</CardTitle>
                    <CardDescription className="text-sm">{counsellor.title}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Specializations</Label>
                    <div className="flex flex-wrap gap-1">
                      {counsellor.specializations.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <Label className="text-xs font-medium">Experience</Label>
                      <p className="text-muted-foreground">{counsellor.experience} years</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Languages</Label>
                      <p className="text-muted-foreground">{counsellor.languages.join(", ")}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Session Types</Label>
                    <div className="flex gap-1">
                      {counsellor.session_types?.map((type) => {
                        const IconComponent = getSessionIcon(type);
                        return (
                          <Badge key={type} variant="outline" className="text-xs">
                            <IconComponent className="w-3 h-3 mr-1" />
                            {type}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {counsellor.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === "select-time" && selectedCounsellor && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose your preferred appointment date</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Session Type</CardTitle>
                  <CardDescription>How would you like to meet?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedCounsellor.session_types?.map((type) => {
                      const IconComponent = getSessionIcon(type);
                      return (
                        <Button
                          key={type}
                          variant={sessionType === type ? "default" : "outline"}
                          onClick={() => setSessionType(type)}
                          className="justify-start h-auto p-4"
                        >
                          <IconComponent className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">
                              {type.charAt(0).toUpperCase() + type.slice(1)} Session
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {type === "video" && "Secure video call"}
                              {type === "phone" && "Phone consultation"}
                              {type === "in-person" && "Face-to-face meeting"}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {selectedDate && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Available Times</CardTitle>
                    <CardDescription>
                      {format(selectedDate, "EEEE, MMMM do")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className="justify-center"
                          size="sm"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {step === "details" && (
          <Card className="shadow-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Help us prepare for your session (all information is confidential)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Optional)</Label>
                  <Input
                    id="name"
                    value={bookingDetails.name}
                    onChange={(e) => setBookingDetails(prev => ({...prev, name: e.target.value}))}
                    placeholder="Can remain anonymous"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingDetails.email}
                    onChange={(e) => setBookingDetails(prev => ({...prev, email: e.target.value}))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingDetails.phone}
                  onChange={(e) => setBookingDetails(prev => ({...prev, phone: e.target.value}))}
                  placeholder="For appointment reminders"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Session Priority</Label>
                <Select 
                  value={bookingDetails.urgency} 
                  onValueChange={(value) => setBookingDetails(prev => ({...prev, urgency: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine (within 2 weeks)</SelectItem>
                    <SelectItem value="urgent">Urgent (within 3 days)</SelectItem>
                    <SelectItem value="crisis">Crisis (same day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concerns">What would you like to discuss? (Optional)</Label>
                <Textarea
                  id="concerns"
                  value={bookingDetails.concerns}
                  onChange={(e) => setBookingDetails(prev => ({...prev, concerns: e.target.value}))}
                  placeholder="Brief description of what you'd like to work on..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "select-time") setStep("select-counsellor");
                  else if (step === "details") setStep("select-time");
                }}
                disabled={step === "select-counsellor" || loading}
              >
                Previous
              </Button>
              
              <Button
                onClick={() => {
                  if (step === "select-counsellor" && selectedCounsellor) setStep("select-time");
                  else if (step === "select-time" && selectedDate && selectedTime) setStep("details");
                  else if (step === "details") handleBooking();
                }}
                disabled={
                  (step === "select-counsellor" && !selectedCounsellor) ||
                  (step === "select-time" && (!selectedDate || !selectedTime)) ||
                  (step === "details" && !bookingDetails.email) ||
                  loading
                }
                className="bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? "Processing..." : (step === "details" ? "Confirm Booking" : "Next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Booking;




