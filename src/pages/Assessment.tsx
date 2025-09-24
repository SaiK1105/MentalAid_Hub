import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, Home, AlertTriangle, CheckCircle, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  scale: string[];
  category: "depression" | "anxiety" | "stress";
}

const Assessment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTest, setCurrentTest] = useState<"select" | "dass21" | "results">("select");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testResults, setTestResults] = useState<{
    dass21?: { depression: number; anxiety: number; stress: number };
  }>({});
  const [loading, setLoading] = useState(false);

  const dass21Questions: Question[] = [
    { id: "dass21_1", text: "I found it hard to wind down.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_2", text: "I was aware of dryness of my mouth.", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_3", text: "I couldn't seem to experience any positive feeling at all.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_4", text: "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion).", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_5", text: "I found it difficult to work up the initiative to do things.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_6", text: "I tended to over-react to situations.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_7", text: "I experienced trembling (e.g., in the hands).", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_8", text: "I felt that I was using a lot of nervous energy.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_9", text: "I was worried about situations in which I might panic and make a fool of myself.", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_10", text: "I felt that I had nothing to look forward to.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_11", text: "I found myself getting agitated.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_12", text: "I found it difficult to relax.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_13", text: "I felt down-hearted and blue.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_14", text: "I was intolerant of anything that kept me from getting on with what I was doing.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_15", text: "I felt I was close to panic.", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_16", text: "I was unable to become enthusiastic about anything.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_17", text: "I felt I wasn't worth much as a person.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_18", text: "I felt that I was rather touchy.", category: "stress", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_19", text: "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat).", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_20", text: "I felt scared without any good reason.", category: "anxiety", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
    { id: "dass21_21", text: "I felt that life was meaningless.", category: "depression", scale: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me to a considerable degree", "Applied to me very much"] },
  ];

  const getCurrentQuestions = () => {
    return dass21Questions;
  };

  const handleAnswer = (value: string) => {
    const questions = getCurrentQuestions();
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
  };

  const getSeverityLevel = (score: number, type: "depression" | "anxiety" | "stress") => {
    switch (type) {
      case "depression":
        if (score <= 9) return { level: "Normal", color: "secondary" };
        if (score <= 13) return { level: "Mild", color: "outline" };
        if (score <= 20) return { level: "Moderate", color: "outline" };
        if (score <= 27) return { level: "Severe", color: "destructive" };
        return { level: "Extremely Severe", color: "destructive" };
      case "anxiety":
        if (score <= 7) return { level: "Normal", color: "secondary" };
        if (score <= 9) return { level: "Mild", color: "outline" };
        if (score <= 14) return { level: "Moderate", color: "outline" };
        if (score <= 19) return { level: "Severe", color: "destructive" };
        return { level: "Extremely Severe", color: "destructive" };
      case "stress":
        if (score <= 14) return { level: "Normal", color: "secondary" };
        if (score <= 18) return { level: "Mild", color: "outline" };
        if (score <= 25) return { level: "Moderate", color: "outline" };
        if (score <= 33) return { level: "Severe", color: "destructive" };
        return { level: "Extremely Severe", color: "destructive" };
      default:
        return { level: "Unknown", color: "secondary" };
    }
  };

  const nextQuestion = () => {
    const questions = getCurrentQuestions();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You need to be logged in to save your results.",
        variant: "destructive",
      });
      return;
    }

    let depressionScore = 0;
    let anxietyScore = 0;
    let stressScore = 0;

    dass21Questions.forEach(q => {
      const answer = answers[q.id] || 0;
      if (q.category === "depression") depressionScore += answer;
      else if (q.category === "anxiety") anxietyScore += answer;
      else if (q.category === "stress") stressScore += answer;
    });
    
    // DASS-21 scores are multiplied by 2
    depressionScore *= 2;
    anxietyScore *= 2;
    stressScore *= 2;

    const results = {
      depression: depressionScore,
      anxiety: anxietyScore,
      stress: stressScore,
    };

    setTestResults({ dass21: results });

    setLoading(true);
    const { error } = await supabase.from('assessments').insert({
      user_id: user.id,
      type: 'DASS-21',
      score: null, // Not storing a single score
      severity_level: null, // Severity is per category
      responses: answers,
      dass21_scores: results,
    });
    setLoading(false);

    if (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Save Failed",
        description: `Could not save DASS-21 results. Please try again.`,
        variant: "destructive",
      });
      return;
    }

    setCurrentTest("results");
  };

  const getRecommendations = () => {
    const scores = testResults.dass21;
    if (!scores) return { urgent: false, title: "", description: "", actions: [] };

    const isSevere = scores.depression > 20 || scores.anxiety > 14 || scores.stress > 25;
    const isModerate = scores.depression > 13 || scores.anxiety > 9 || scores.stress > 18;

    if (isSevere) {
      return {
        urgent: true,
        title: "Immediate Support Recommended",
        description: "Your scores indicate severe symptoms. Please consider reaching out for urgent support.",
        actions: [
          { label: "AI Crisis Support", action: () => navigate("/ai-chat?urgent=true"), variant: "outline" }
        ]
      };
    } else if (isModerate) {
      return {
        urgent: false,
        title: "Consider Additional Support",
        description: "Your scores indicate moderate symptoms. Professional guidance could be helpful.",
        actions: [
          { label: "Explore Resources", action: () => navigate("/resources"), variant: "default" },
          { label: "Book Consultation", action: () => navigate("/booking"), variant: "outline" }
        ]
      };
    } else {
      return {
        urgent: false,
        title: "Continue Self-Care",
        description: "Your scores are in the lower range, but continue monitoring your mental health.",
        actions: [
          { label: "Browse Resources", action: () => navigate("/resources"), variant: "default" },
          { label: "Chat with AI", action: () => navigate("/ai-chat"), variant: "outline" }
        ]
      };
    }
  };

  if (currentTest === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-2xl mx-auto space-y-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="p-2">
              <Home className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">{t('assessment.title')}</h1>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t('assessment.title')}</CardTitle>
              <CardDescription>
                This standardized tool helps evaluate your mental health. All responses are confidential.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setCurrentTest("dass21")}
                className="w-full justify-start h-auto p-4 text-left"
                variant="outline"
              >
                <div className="space-y-1">
                  <div className="font-semibold">DASS-21 Questionnaire</div>
                  <div className="text-sm text-muted-foreground">
                    21 questions • Assesses depression, anxiety, and stress symptoms.
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentTest === "results") {
    const recommendations = getRecommendations();
    const scores = testResults.dass21;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-2xl mx-auto space-y-6 py-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full shadow-soft">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Assessment Complete</h1>
          </div>

          <div className="space-y-4">
            {scores && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Depression Score
                      <Badge variant={getSeverityLevel(scores.depression, "depression").color as any}>
                        {getSeverityLevel(scores.depression, "depression").level}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{scores.depression}/42</div>
                    <Progress value={(scores.depression / 42) * 100} className="mb-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Anxiety Score
                      <Badge variant={getSeverityLevel(scores.anxiety, "anxiety").color as any}>
                        {getSeverityLevel(scores.anxiety, "anxiety").level}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{scores.anxiety}/42</div>
                    <Progress value={(scores.anxiety / 42) * 100} className="mb-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Stress Score
                      <Badge variant={getSeverityLevel(scores.stress, "stress").color as any}>
                        {getSeverityLevel(scores.stress, "stress").level}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{scores.stress}/42</div>
                    <Progress value={(scores.stress / 42) * 100} className="mb-2" />
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card className={recommendations.urgent ? "border-destructive bg-destructive/5" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {recommendations.urgent ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <Heart className="w-5 h-5 text-primary" />
                )}
                {recommendations.title}
              </CardTitle>
              <CardDescription>{recommendations.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  variant={action.variant as any}
                  className="w-full"
                >
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const questions = getCurrentQuestions();
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">DASS-21 Screening</h1>
            <Badge variant="outline">
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              Please read each statement and select the option which indicates how much the statement applied to you over the past week.
            </CardTitle>
            <CardDescription className="text-base font-medium text-foreground">
              {currentQ.text}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQ.scale.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0 || loading}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={answers[currentQ.id] === undefined || loading}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            {loading ? "Saving..." : (currentQuestion === questions.length - 1 ? "Complete" : "Next")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
