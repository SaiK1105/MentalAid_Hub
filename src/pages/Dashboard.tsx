import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ClipboardCheck, BookOpen, Calendar, Heart, Shield } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
    display_name: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  const [userPrefs] = useState(() => {
    const saved = localStorage.getItem("userPrefs");
    return saved ? JSON.parse(saved) : { isAnonymous: true, language: "en" };
  });

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', user.id)
            .single();

        if (error) {
            console.error("Error fetching profile", error);
            toast({ title: "Error", description: "Could not fetch your profile.", variant: "destructive" });
        } else if (data) {
            setProfile(data);
        }
    };
    fetchProfile();
  }, [user, toast]);


  const features = [
    {
      id: "ai-chat",
      title: t('dashboard.aiChat'),
      description: t('dashboard.aiChatDesc'),
      icon: MessageSquare,
      color: "from-primary to-primary-glow",
      path: "/ai-chat",
      ctaKey: "dashboard.aiChatCta",
      urgent: false
    },
    {
      id: "assessment",
      title: t('dashboard.assessment'), 
      description: t('dashboard.assessmentDesc'),
      icon: ClipboardCheck,
      color: "from-secondary to-primary",
      path: "/assessment",
      ctaKey: "assessment.start",
      urgent: false
    },
    {
      id: "resources",
      title: t('dashboard.resources'),
      description: t('dashboard.resourcesDesc'),
      icon: BookOpen,
      color: "from-accent to-secondary",
      path: "/resources",
      ctaKey: "dashboard.resourcesCta",
      urgent: false
    },
    {
      id: "book-counselor",
      title: t('dashboard.booking'),
      description: t('dashboard.bookingDesc'),
      icon: Calendar,
      color: "from-secondary to-accent",
      path: "/booking",
      ctaKey: "dashboard.bookingCta",
      urgent: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-3 rounded-full shadow-soft">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t('dashboard.welcome')}, {profile?.display_name || 'there'}!</h1>
            <p className="text-muted-foreground">
              {t('dashboard.howFeeling')}
            </p>
            {userPrefs.isAnonymous && (
              <Badge variant="secondary" className="inline-flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {t('welcome.anonymousMode')}
              </Badge>
            )}
            <div className="pt-2">
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
          <LanguageSelector variant="compact" />
        </div>

        {/* Quick Access Crisis Support */}
        <Card className="border-destructive/20 bg-gradient-to-r from-destructive/5 to-warning/5 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive flex items-center gap-2">
              <Heart className="w-5 h-5" />
              {t('crisis.needHelp')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => window.open("tel:1075", "_self")}
                className="flex-1"
              >
                {t('crisis.hotline')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/ai-chat?urgent=true")}
                className="flex-1"
              >
                {t('crisis.emergency')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="group hover:shadow-card transition-all duration-300 cursor-pointer border-0 overflow-hidden"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl shadow-soft`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    {feature.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    {t(feature.ctaKey)} →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Remember: You're not alone in this journey
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>🔒 Confidential</span>
            <span>🤝 Professional</span>
            <span>🌟 Always Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
