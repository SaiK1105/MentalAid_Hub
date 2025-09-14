import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Shield } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";

const Welcome = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleContinue = () => {
    // Store preferences in localStorage
    localStorage.setItem("userPrefs", JSON.stringify({ language: i18n.language, isAnonymous }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-3 rounded-full shadow-soft">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('welcome.title')}
          </h1>
          <p className="text-muted-foreground">{t('welcome.subtitle')}</p>
        </div>

        {/* Welcome Card */}
        <Card className="shadow-card border-0">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl">Welcome to a Safe Space</CardTitle>
            <CardDescription className="text-sm">
              Your mental health matters. Set your preferences to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <LanguageSelector />

            {/* Anonymity Toggle */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Shield className="w-4 h-4" />
                {t('welcome.anonymousMode')}
              </Label>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t('welcome.anonymousMode')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('welcome.anonymousDesc')}
                  </p>
                </div>
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>
            </div>

            {/* Continue Button */}
            <Button 
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              {t('welcome.continue')}
            </Button>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            🔒 End-to-end encrypted • 🤝 Confidential • 🌟 Available 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;