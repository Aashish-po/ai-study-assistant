 
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { saveQuizHistoryItem } from "@/lib/quiz-history";
interface Question {
  id: string;
  question: string;
  type: "mcq" | "longform";
  options?: string[];
  correctAnswer: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: "1",
    question: "What is the primary function of photosynthesis?",
    type: "mcq",
    options: [
      "Convert light energy to chemical energy",
      "Break down glucose for energy",
      "Transport water through plants",
      "Produce oxygen only",
    ],
    correctAnswer: "Convert light energy to chemical energy",
  },
  {
    id: "2",
    question: "Where do the light reactions occur?",
    type: "mcq",
    options: ["Stroma", "Thylakoid membrane", "Mitochondria", "Nucleus"],
    correctAnswer: "Thylakoid membrane",
  },
  {
    id: "3",
    question: "Explain the role of chlorophyll in photosynthesis.",
    type: "longform",
    correctAnswer:
      "Chlorophyll absorbs light energy and converts it to chemical energy.",
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const colors = useColors();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const question = QUIZ_QUESTIONS[currentQuestion];
  useEffect(() => {
    if (!quizComplete || sessionSaved) return;

    const persistQuizSession = async () => {
      await saveQuizHistoryItem({
        topic: "Photosynthesis",
        score,
        totalQuestions: QUIZ_QUESTIONS.length,
      });
      setSessionSaved(true);
    };

    persistQuizSession();
  }, [quizComplete, score, sessionSaved]);

  const handleAnswer = (answer: string) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === question.correctAnswer) {
      setScore(score + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setQuizComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswered(false);
    setQuizComplete(false);
    setSessionSaved(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (quizComplete) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="justify-center"
        >
          <View className="items-center">
            <View className="bg-success/10 rounded-full p-6 mb-6">
              <IconSymbol
                name="checkmark.circle.fill"
                size={60}
                color={colors.success}
              />
            </View>

            <Text className="text-3xl font-bold text-foreground mb-2">
              Quiz Complete!
            </Text>

            <View className="bg-surface rounded-2xl p-8 w-full my-6 border border-border">
              <Text className="text-center text-muted mb-2">Your Score</Text>
              <Text className="text-5xl font-bold text-primary text-center">
                {score}/{QUIZ_QUESTIONS.length}
              </Text>
              <Text className="text-center text-muted mt-2">
                {Math.round((score / QUIZ_QUESTIONS.length) * 100)}% Correct
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleRestart}
              className="rounded-xl py-4 px-8 w-full mb-3"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold text-center">
                Retake Quiz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="rounded-xl py-4 px-8 w-full border border-border"
            >
              <Text className="text-foreground font-semibold text-center">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6 border-b border-border">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol
                name="chevron.right"
                size={24}
                color={colors.foreground}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-foreground">
              Question {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="bg-border rounded-full h-2 overflow-hidden">
            <View
              className="bg-primary h-full"
              style={{
                width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Question Content */}
        <View className="px-6 py-8">
          <Text className="text-2xl font-bold text-foreground mb-8 leading-relaxed">
            {question.question}
          </Text>

          {question.type === "mcq" && question.options && (
            <FlatList
              data={question.options}
              renderItem={({ item }) => {
                const isSelected = selectedAnswer === item;
                const isCorrect = item === question.correctAnswer;
                const showResult = answered && (isSelected || isCorrect);

                return (
                  <TouchableOpacity
                    onPress={() => handleAnswer(item)}
                    disabled={answered}
                    className={`rounded-xl p-4 mb-3 border-2 ${
                      showResult
                        ? isCorrect
                          ? "border-success bg-success/10"
                          : "border-error bg-error/10"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success"
                              : "border-error bg-error"
                            : isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                        }`}
                      >
                        {showResult && (
                          <IconSymbol
                            name={
                              isCorrect
                                ? "checkmark.circle.fill"
                                : "xmark.circle.fill"
                            }
                            size={16}
                            color="white"
                          />
                        )}
                      </View>
                      <Text className="flex-1 text-foreground font-medium">
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item}
              scrollEnabled={false}
            />
          )}

          {answered && (
            <View className="bg-primary/10 border border-primary/30 rounded-xl p-4 mt-6 mb-6">
              <View className="flex-row items-start gap-3">
                <IconSymbol
                  name="lightbulb.fill"
                  size={20}
                  color={colors.primary}
                />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground mb-1">
                    {selectedAnswer === question.correctAnswer
                      ? "Correct!"
                      : "Incorrect"}
                  </Text>
                  <Text className="text-sm text-muted">
                    The correct answer is: {question.correctAnswer}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {answered && (
            <TouchableOpacity
              onPress={handleNext}
              className="rounded-xl py-4 px-6 flex-row items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold">
                {currentQuestion === QUIZ_QUESTIONS.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Text>
              <IconSymbol
                name="chevron.right"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
