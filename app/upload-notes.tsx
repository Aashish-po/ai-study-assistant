import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "History", "English", "Other"];

export default function UploadNotesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "text/plain"],
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setFileName(file.name);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedSubject || (!fileName && !notes)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Simulate upload and processing
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/summarization" as any);
    }, 2000);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Upload Notes</Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6">
          {/* Subject Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Select Subject
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  onPress={() => {
                    setSelectedSubject(subject);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    backgroundColor:
                      selectedSubject === subject
                        ? colors.primary
                        : colors.surface,
                  }}
                  className="px-4 py-2 rounded-full border border-border"
                >
                  <Text
                    className={`font-medium ${
                      selectedSubject === subject
                        ? "text-white"
                        : "text-foreground"
                    }`}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Upload File Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Upload File
            </Text>
            <TouchableOpacity
              onPress={handlePickDocument}
              className="border-2 border-dashed border-primary/40 rounded-2xl p-8 items-center justify-center"
            >
              <IconSymbol
                name="cloud.upload.fill"
                size={40}
                color={colors.primary}
              />
              <Text className="text-base font-semibold text-foreground mt-3">
                {fileName || "Choose File"}
              </Text>
              <Text className="text-sm text-muted mt-1">
                PDF, Images, or Text
              </Text>
            </TouchableOpacity>
          </View>

          {/* Or Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-3 text-muted">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Paste Notes Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Paste Notes
            </Text>
            <TextInput
              placeholder="Paste your study notes here..."
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={6}
              className="bg-surface border border-border rounded-xl p-4 text-foreground"
              style={{ color: colors.foreground }}
            />
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            onPress={handleUpload}
            disabled={isLoading}
            className={`rounded-xl py-4 px-6 flex-row items-center justify-center ${
              isLoading ? "opacity-60" : ""
            }`}
            style={{ backgroundColor: colors.primary }}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-2">Processing...</Text>
              </>
            ) : (
              <>
                <IconSymbol
                  name="cloud.upload.fill"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-semibold ml-2">
                  Upload & Summarize
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View className="bg-primary/10 border border-primary/30 rounded-xl p-4 mt-6">
            <View className="flex-row items-start gap-3">
              <IconSymbol
                name="lightbulb.fill"
                size={20}
                color={colors.primary}
              />
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-1">
                  AI Summarization
                </Text>
                <Text className="text-sm text-muted">
                  Our AI will analyze your notes and create summaries, key points, and generate practice questions.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
