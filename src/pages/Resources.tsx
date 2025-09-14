import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Home, Search, Video, Headphones, FileText, ExternalLink, Heart, Brain, Users } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "audio" | "pdf";
  category: "anxiety" | "depression" | "stress" | "coping" | "crisis";
  duration?: string;
  url: string;
  language: string;
}

const Resources = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const resources: Resource[] = [
    {
      id: "1",
      title: "Coping with Anxiety",
      description: "A comprehensive article from the Anxiety & Depression Association of America on understanding and managing anxiety.",
      type: "article",
      category: "anxiety",
      url: "https://adaa.org/learn-from-us/from-the-experts/blog-posts/consumer/coping-anxiety",
      language: "English"
    },
    {
      id: "2",
      title: "Guided Meditation for Stress",
      description: "A 10-minute guided audio meditation to help you calm your mind and reduce stress.",
      type: "audio",
      category: "stress",
      duration: "10 min",
      url: "https://www.calm.com/breathe",
      language: "English"
    },
    {
      id: "3",
      title: "Understanding Depression",
      description: "The Mayo Clinic's expert overview of depression symptoms, causes, and treatments.",
      type: "article",
      category: "depression",
      url: "https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007",
      language: "English"
    },
    {
      id: "4",
      title: "Breathing Exercises for Panic Attacks",
      description: "A short video guide to simple breathing techniques to use during a panic attack.",
      type: "video",
      category: "anxiety",
      duration: "4 min",
      url: "https://www.youtube.com/watch?v=YRPh_GaiL8s",
      language: "English"
    },
    {
      id: "5",
      title: "Coping Skills Worksheets",
      description: "A collection of printable worksheets and handouts from the Centre for Clinical Interventions (CCI) to help with various coping strategies.",
      type: "pdf",
      category: "coping",
      url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Coping-Skills",
      language: "English"
    },
    {
      id: "6",
      title: "5 Tips to Manage Stress",
      description: "A quick read from the National Institute of Mental Health (NIMH) with practical advice for managing everyday stress.",
      type: "article",
      category: "stress",
      url: "https://www.nimh.nih.gov/health/publications/stress-and-mental-health",
      language: "English"
    },
    {
      id: "7",
      title: "What to Do When You Feel Overwhelmed",
      description: "A helpful video from a licensed therapist on how to process and manage overwhelming feelings.",
      type: "video",
      category: "coping",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=i90Uf19R2Yw",
      language: "English"
    },
    {
      id: "8",
      title: "Depression and Sleep: A Guide",
      description: "A PDF guide from Psychology Tools explaining the link between depression and sleep, with practical tips to improve sleep hygiene.",
      type: "pdf",
      category: "depression",
      url: "https://psychology.tools/download/sleep-hygiene-for-depression.pdf",
      language: "English"
    },
    {
      id: "9",
      title: "Crisis and Emergency Services",
      description: "Information and contact numbers for immediate crisis support and emergency services.",
      type: "article",
      category: "crisis",
      url: "https://www.nami.org/help",
      language: "English"
    },
    {
      id: "10",
      title: "Mindfulness for Beginners",
      description: "A video introduction to mindfulness and how it can help reduce anxiety and stress in daily life.",
      type: "video",
      category: "anxiety",
      duration: "7 min",
      url: "https://www.youtube.com/watch?v=O1fN93d0_o4",
      language: "English"
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "audio": return Headphones;
      case "pdf": return FileText;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "anxiety": return "from-primary to-primary-glow";
      case "depression": return "from-secondary to-primary";
      case "stress": return "from-accent to-secondary";
      case "coping": return "from-muted to-accent";
      case "crisis": return "from-destructive to-warning";
      default: return "from-primary to-secondary";
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || resource.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const categories = [
    { id: "all", label: "All Resources", icon: BookOpen },
    { id: "anxiety", label: "Anxiety", icon: Brain },
    { id: "depression", label: "Depression", icon: Heart },
    { id: "stress", label: "Stress", icon: Users },
    { id: "coping", label: "Coping Skills", icon: Heart },
    { id: "crisis", label: "Crisis Support", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">{t('resources.title')}</h1>
          </div>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  <IconComponent className="w-4 h-4 mr-1" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = getResourceIcon(resource.type);
                return (
                  <Card key={resource.id} className="group hover:shadow-card transition-all duration-300 cursor-pointer overflow-hidden">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className={`bg-gradient-to-r ${getCategoryColor(resource.category)} p-3 rounded-xl shadow-soft`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          {resource.duration && (
                            <Badge variant="outline" className="text-xs">
                              {resource.duration}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {resource.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{resource.language}</span>
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or browsing different categories.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Access */}
        <Card className="shadow-card bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Need Immediate Support?
            </CardTitle>
            <CardDescription>
              Access crisis resources and professional help right away.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="destructive"
              onClick={() => window.open("tel:1075", "_self")}
              className="flex-1"
            >
              Crisis Hotline: 1075
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/ai-chat?urgent=true")}
              className="flex-1"
            >
              Emergency AI Support
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/booking")}
              className="flex-1"
            >
              Book Counsellor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
