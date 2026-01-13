import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Users, Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { QuizCard } from "@/components/quiz/QuizCard";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizResults } from "@/components/quiz/QuizResults";
import { sampleQuizzes } from "@/data/sampleQuizzes";
import { Quiz, QuizResult } from "@/types/quiz";

type ViewState = "home" | "quiz" | "results";

const Index = () => {
  const [view, setView] = useState<ViewState>("home");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: number; isCorrect: boolean }[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = (quizId: string) => {
    const quiz = sampleQuizzes.find((q) => q.id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setStartTime(Date.now());
      setView("quiz");
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuiz) return;
    const question = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correctAnswer;
    setAnswers([...answers, { questionId: question.id, selectedAnswer: answerIndex, isCorrect }]);
  };

  const handleNext = () => {
    if (!currentQuiz) return;
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate results
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const score = correctAnswers * 100;
      
      setResult({
        quizId: currentQuiz.id,
        score,
        totalQuestions: currentQuiz.questions.length,
        correctAnswers,
        timeTaken,
        answers,
      });
      setView("results");
    }
  };

  const handleRetry = () => {
    if (currentQuiz) {
      handleStartQuiz(currentQuiz.id);
    }
  };

  const handleHome = () => {
    setView("home");
    setCurrentQuiz(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {view === "home" && (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 md:py-32">
            {/* Background decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  Learn. Challenge. Master.
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                  Test Your Knowledge with{" "}
                  <span className="text-gradient">Interactive Quizzes</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Challenge yourself with engaging quizzes across various topics. 
                  Learn something new, track your progress, and have fun!
                </p>

                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    { icon: Zap, label: "Instant Feedback" },
                    { icon: Users, label: "Multiple Categories" },
                    { icon: Trophy, label: "Track Progress" },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <feature.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Quiz Grid */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Popular Quizzes
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Pick a quiz to get started. Each quiz is designed to challenge and educate.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleQuizzes.map((quiz, i) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <QuizCard quiz={quiz} onStart={handleStartQuiz} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {view === "quiz" && currentQuiz && (
        <section className="min-h-[calc(100vh-4rem)] py-12 px-4">
          <QuizQuestion
            question={currentQuiz.questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={currentQuiz.questions.length}
            timeLimit={currentQuiz.timePerQuestion}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </section>
      )}

      {view === "results" && currentQuiz && result && (
        <section className="min-h-[calc(100vh-4rem)] py-12 px-4 flex items-center justify-center">
          <QuizResults
            quiz={currentQuiz}
            result={result}
            onRetry={handleRetry}
            onHome={handleHome}
          />
        </section>
      )}
    </div>
  );
};

export default Index;
