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

interface Question {
  id: string;
  text: string;
  scale: string[];
}

const Assessment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentTest, setCurrentTest] = useState<"select" | "phq9" | "gad7" | "results">("select");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testResults, setTestResults] = useState<{ phq9?: number; gad7?: number }>({});

  const phq9Questions: Question[] = [
    {
      id: "phq9_1",
      text: "Little interest or pleasure in doing things",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_2", 
      text: "Feeling down, depressed, or hopeless",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_3",
      text: "Trouble falling or staying asleep, or sleeping too much",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_4",
      text: "Feeling tired or having little energy",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_5",
      text: "Poor appetite or overeating",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_6",
      text: "Feeling bad about yourself or that you are a failure",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_7",
      text: "Trouble concentrating on things, such as reading or watching TV",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_8",
      text: "Moving or speaking slowly, or being fidgety or restless",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "phq9_9",
      text: "Thoughts that you would be better off dead or hurting yourself",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ];

  const gad7Questions: Question[] = [
    {
      id: "gad7_1",
      text: "Feeling nervous, anxious, or on edge",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "gad7_2",
      text: "Not being able to stop or control worrying",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "gad7_3",
      text: "Worrying too much about different things",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "gad7_4",
      text: "Trouble relaxing",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "gad7_5",
      text: "Being so restless that it is hard to sit still",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "gad7_6",
      text: "Becoming easily annoyed or irritable",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: "gad7_7",
      text: "Feeling afraid, as if something awful might happen",
      scale: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ];

  const getCurrentQuestions = () => {
    return currentTest === "phq9" ? phq9Questions : gad7Questions;
  };

  const handleAnswer = (value: string) => {
    const questions = getCurrentQuestions();
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: parseInt(value) }));
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

  const calculateResults = () => {
    const questions = getCurrentQuestions();
    const score = questions.reduce((total, question) => {
      return total + (answers[question.id] || 0);
    }, 0);

    setTestResults(prev => ({
      ...prev,
      [currentTest]: score
    }));

    if (currentTest === "phq9" && !testResults.gad7) {
      // Automatically start GAD-7 after PHQ-9
      setCurrentTest("gad7");
      setCurrentQuestion(0);
    } else {
      setCurrentTest("results");
    }
  };

  const getSeverityLevel = (score: number, type: "phq9" | "gad7") => {
    if (type === "phq9") {
      if (score <= 4) return { level: "minimal", color: "secondary" };
      if (score <= 9) return { level: "mild", color: "outline" };
      if (score <= 14) return { level: "moderate", color: "outline" };
      if (score <= 19) return { level: "moderately severe", color: "destructive" };
      return { level: "severe", color: "destructive" };
    } else {
      if (score <= 4) return { level: "minimal", color: "secondary" };
      if (score <= 9) return { level: "mild", color: "outline" };
      if (score <= 14) return { level: "moderate", color: "outline" };
      return { level: "severe", color: "destructive" };
    }
  };

  const getRecommendations = () => {
    const phq9Score = testResults.phq9 || 0;
    const gad7Score = testResults.gad7 || 0;
    const highRisk = phq9Score >= 15 || gad7Score >= 15;

    if (highRisk) {
      return {
        urgent: true,
        title: "Seek Professional Support",
        description: "Your scores suggest you may benefit from professional help. Please consider booking a session with a counsellor.",
        actions: [
          { label: "Book Counsellor Session", action: () => navigate("/booking"), variant: "destructive" },
          { label: "AI Crisis Support", action: () => navigate("/ai-chat?urgent=true"), variant: "outline" }
        ]
      };
    } else if (phq9Score >= 10 || gad7Score >= 10) {
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="p-2"
            >
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
                These standardized tools help evaluate your mental health. All responses are confidential.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setCurrentTest("phq9")}
                className="w-full justify-start h-auto p-4 text-left"
                variant="outline"
              >
                <div className="space-y-1">
                  <div className="font-semibold">{t('assessment.phq9')}</div>
                  <div className="text-sm text-muted-foreground">
                    9 questions • Assesses depression symptoms over the past 2 weeks
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => setCurrentTest("gad7")}
                className="w-full justify-start h-auto p-4 text-left"
                variant="outline"
              >
                <div className="space-y-1">
                  <div className="font-semibold">{t('assessment.gad7')}</div>
                  <div className="text-sm text-muted-foreground">
                    7 questions • Assesses anxiety symptoms over the past 2 weeks
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => setCurrentTest("phq9")}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {t('assessment.start')} (Both Tests)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentTest === "results") {
    const recommendations = getRecommendations();
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

          {/* Results Cards */}
          <div className="space-y-4">
            {testResults.phq9 !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    PHQ-9 Depression Score
                    <Badge variant={getSeverityLevel(testResults.phq9, "phq9").color as any}>
                      {getSeverityLevel(testResults.phq9, "phq9").level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {testResults.phq9}/27
                  </div>
                  <Progress value={(testResults.phq9 / 27) * 100} className="mb-2" />
                </CardContent>
              </Card>
            )}

            {testResults.gad7 !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    GAD-7 Anxiety Score
                    <Badge variant={getSeverityLevel(testResults.gad7, "gad7").color as any}>
                      {getSeverityLevel(testResults.gad7, "gad7").level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {testResults.gad7}/21
                  </div>
                  <Progress value={(testResults.gad7 / 21) * 100} className="mb-2" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations */}
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

  // Question Display
  const questions = getCurrentQuestions();
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              {currentTest === "phq9" ? "Depression Screening (PHQ-9)" : "Anxiety Screening (GAD-7)"}
            </h1>
            <Badge variant="outline">
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              Over the last 2 weeks, how often have you been bothered by:
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

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={answers[currentQ.id] === undefined}
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;