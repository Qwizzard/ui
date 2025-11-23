import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import { FadeIn, SlideIn, ScaleIn } from '../components/animations/MotionComponents';
import { LottieAnimation } from '../components/animations/LottieAnimation';
import { 
  Brain, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Play
} from 'lucide-react';

const demoQuestions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Madrid'],
    correct: 1,
  },
  {
    id: 2,
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
  },
  {
    id: 3,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct: 1,
  },
];

export function Home() {
  const [demoStep, setDemoStep] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const startDemo = () => {
    setDemoStep('playing');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === demoQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < demoQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setDemoStep('completed');
      }
    }, 1000);
  };

  const resetDemo = () => {
    setDemoStep('idle');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <FadeIn>
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Gamified Learning Experience
              </Badge>
            </FadeIn>

            <SlideIn direction="up" delay={0.1}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="gradient-text">Test Your Knowledge</span>
                <br />
                <span className="text-foreground">The Fun Way</span>
              </h1>
            </SlideIn>

            <SlideIn direction="up" delay={0.2}>
              <p className="text-xl text-muted-foreground max-w-lg">
                Create, share, and take quizzes on any topic. Learn while having fun with our 
                interactive quiz platform designed for everyone.
              </p>
            </SlideIn>

            <SlideIn direction="up" delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/quizzes/public">
                  <Button size="lg" variant="outline">
                    Browse Quizzes
                  </Button>
                </Link>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.4}>
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Quizzes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1M+</div>
                  <div className="text-sm text-muted-foreground">Attempts</div>
                </div>
              </div>
            </SlideIn>
          </div>

          {/* Interactive Demo */}
          <ScaleIn delay={0.2}>
            <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              
              <CardContent className="relative p-8 space-y-6">
                {demoStep === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="h-12 w-12 text-primary animate-pulse-slow" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">Try Our Demo Quiz!</h3>
                      <p className="text-muted-foreground">
                        Experience how fun and interactive quizzes can be
                      </p>
                    </div>
                    <Button size="lg" onClick={startDemo} className="w-full group">
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Start Demo
                    </Button>
                  </motion.div>
                )}

                {demoStep === 'playing' && (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        Question {currentQuestion + 1}/{demoQuestions.length}
                      </Badge>
                      <div className="flex gap-1">
                        {demoQuestions.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 w-8 rounded-full transition-colors ${
                              idx <= currentQuestion ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold">
                      {demoQuestions[currentQuestion].question}
                    </h3>

                    <div className="space-y-3">
                      {demoQuestions[currentQuestion].options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                          whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                          onClick={() => selectedAnswer === null && handleAnswerSelect(idx)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
                            selectedAnswer === null
                              ? 'border-border hover:border-primary hover:bg-primary/5'
                              : selectedAnswer === idx
                              ? idx === demoQuestions[currentQuestion].correct
                                ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
                                : 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400'
                              : idx === demoQuestions[currentQuestion].correct
                              ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400'
                              : 'border-border opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedAnswer !== null &&
                              idx === demoQuestions[currentQuestion].correct && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {demoStep === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="mx-auto w-32 h-32">
                      <LottieAnimation 
                        animationType="celebration" 
                        className="w-full h-full"
                        loop={false}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold">
                        {score === demoQuestions.length
                          ? 'Perfect Score! 🎉'
                          : score >= demoQuestions.length / 2
                          ? 'Well Done! 👏'
                          : 'Nice Try! 💪'}
                      </h3>
                      <p className="text-xl text-muted-foreground">
                        You scored {score} out of {demoQuestions.length}
                      </p>
                      <div className="text-6xl font-bold text-primary py-4">
                        {Math.round((score / demoQuestions.length) * 100)}%
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={resetDemo} variant="outline" className="flex-1">
                        Try Again
                      </Button>
                      <Link to="/register" className="flex-1">
                        <Button className="w-full">Create Account</Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </ScaleIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-card/50">
        <div className="text-center space-y-4 mb-16">
          <FadeIn>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Zap className="h-3 w-3 mr-1" />
              Features
            </Badge>
          </FadeIn>
          <SlideIn direction="up" delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to
              <span className="gradient-text"> Learn & Teach</span>
            </h2>
          </SlideIn>
          <SlideIn direction="up" delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make creating and taking quizzes a breeze
            </p>
          </SlideIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'AI-Powered Quiz Generation',
              description: 'Create quizzes instantly with our intelligent quiz generator',
              delay: 0,
            },
            {
              icon: Users,
              title: 'Share with Anyone',
              description: 'Make your quizzes public or keep them private for specific groups',
              delay: 0.1,
            },
            {
              icon: Trophy,
              title: 'Track Your Progress',
              description: 'Monitor your improvement with detailed analytics and scores',
              delay: 0.2,
            },
            {
              icon: Zap,
              title: 'Instant Feedback',
              description: 'Get immediate results and explanations for every question',
              delay: 0.3,
            },
            {
              icon: Sparkles,
              title: 'Beautiful Interface',
              description: 'Enjoy a modern, clean design that makes learning fun',
              delay: 0.4,
            },
            {
              icon: CheckCircle,
              title: 'Multiple Quiz Types',
              description: 'Support for various question formats and difficulty levels',
              delay: 0.5,
            },
          ].map((feature, idx) => (
            <ScaleIn key={idx} delay={feature.delay}>
              <Card className="card-hover h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <ScaleIn delay={0.1}>
          <Card className="relative overflow-hidden border-2 border-primary">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
            <CardContent className="relative p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of learners and educators already using Quiz-Me
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </ScaleIn>
      </section>
    </div>
  );
}

