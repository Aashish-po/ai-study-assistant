import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { VisionResult, processVisionFile } from "@/services/vision.service";
import Constants from "expo-constants";



const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "History", "English", "Other"];

type UploadAsset = {
  uri: string;
  name: string;
  type: string;
};

export default function UploadNotesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topic?: string | string[];
    subject?: string | string[];
  }>();
  const colors = useColors();
   //  Access your env variables here
  import Constants from "expo-constants";
  const sessionId = Constants.expoConfig.extra?.env?.APP_SESSION_ID;
  const dbHost = Constants.expoConfig.extra?.env?.DB_HOST;

  console.log("Session ID:", sessionId);
  console.log("DB Host:", dbHost);


  const topicParam = useMemo(() => {
    if (Array.isArray(params.topic)) return params.topic[0] ?? "";
    return params.topic ?? "";
  }, [params.topic]);
  const subjectParam = useMemo(() => {
    if (Array.isArray(params.subject)) return params.subject[0] ?? "";
    return params.subject ?? "";
  }, [params.subject]);
  const suggestedTopic = useMemo(() => topicParam.trim(), [topicParam]);
  const initialSubject = useMemo(() => {
    if (!subjectParam) return null;
    return SUBJECTS.includes(subjectParam) ? subjectParam : "Other";
  }, [subjectParam]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(initialSubject);
  const [selectedFile, setSelectedFile] = useState<UploadAsset | null>(null);
  const [notes, setNotes] = useState<string>(suggestedTopic ? `Topic: ${suggestedTopic}\n` : "");
  const [isLoading, setIsLoading] = useState(false);
  const [visionResult, setVisionResult] = useState<VisionResult | null>(null);
  const [visionError, setVisionError] = useState<string | null>(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) return;

      const fileName = asset.name ?? `document-${Date.now()}`;
      setSelectedFile({
        uri: asset.uri,
        name: fileName,
        type: ensureVisionMimeType(asset.mimeType, fileName),
      });
      setVisionResult(null);
      setVisionError(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error picking document:", error);
      setVisionError("Could not read the selected file");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setVisionError("Camera access is required to capture a photo");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (
        ("canceled" in result && result.canceled) ||
        ("cancelled" in result && result.cancelled)
      ) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const fileName = asset.fileName ?? `photo-${Date.now()}.jpg`;
      setSelectedFile({
        uri: asset.uri,
        name: fileName,
        type: ensureVisionMimeType(asset.mimeType, fileName),
      });
      setVisionResult(null);
      setVisionError(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Photo capture failed:", error);
      setVisionError("Could not capture a photo");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleUpload = async () => {
    if (!selectedSubject || !selectedFile) {
      setVisionError("Please pick a subject and attach a file or photo.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setVisionError(null);
    setVisionResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: "base64",
      });

      const response = await processVisionFile({
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        base64,
        subject: selectedSubject,
        topic: suggestedTopic || undefined,
        notes: notes.trim() ? notes : undefined,
      });

      setVisionResult(response);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Vision processing failed";
      setVisionError(message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
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
          <Text className="text-2xl font-bold text-foreground">
            Upload Notes
          </Text>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6">
          {suggestedTopic ? (
            <View className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
              <Text className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
                Session Topic
              </Text>
              <Text className="text-base text-foreground">
                {suggestedTopic}
              </Text>
            </View>
          ) : null}

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
                {selectedFile?.name ?? "Choose File"}
              </Text>
              <Text className="text-sm text-muted mt-1">
                {selectedFile?.type ?? "PDF, Images, or Text"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="mt-3 rounded-2xl border border-primary/40 px-5 py-3 flex-row items-center justify-center gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <IconSymbol name="camera.fill" size={18} color={colors.primary} />
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.primary }}
              >
                Capture Photo
              </Text>
            </TouchableOpacity>
            {visionError ? (
              <Text className="text-sm mt-3" style={{ color: "#ef4444" }}>
                {visionError}
              </Text>
            ) : null}
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
                <Text className="text-white font-semibold ml-2">
                  Processing...
                </Text>
              </>
            ) : (
              <>
                <IconSymbol name="cloud.upload.fill" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Start AI Session
                </Text>
              </>
            )}
          </TouchableOpacity>

          {visionResult ? (
            <View className="bg-surface border border-border rounded-2xl p-4 mt-6 space-y-4">
              <Text className="text-lg font-semibold text-foreground">
                Vision Summary
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                {visionResult.summary}
              </Text>
              {visionResult.keyPoints.length > 0 ? (
                <View className="space-y-1">
                  <Text className="font-semibold text-sm text-foreground">
                    Key Points
                  </Text>
                  {visionResult.keyPoints.map((point, index) => (
                    <Text
                      key={`kp-${index}`}
                      className="text-sm text-foreground"
                    >
                      • {point}
                    </Text>
                  ))}
                </View>
              ) : null}
              {visionResult.takeaways.length > 0 ? (
                <View className="space-y-1">
                  <Text className="font-semibold text-sm text-foreground">
                    Takeaways
                  </Text>
                  {visionResult.takeaways.map((takeaway, index) => (
                    <Text
                      key={`ta-${index}`}
                      className="text-sm text-foreground"
                    >
                      • {takeaway}
                    </Text>
                  ))}
                </View>
              ) : null}
              {visionResult.questions.length > 0 ? (
                <View className="space-y-1">
                  <Text className="font-semibold text-sm text-foreground">
                    Practice Questions
                  </Text>
                  {visionResult.questions.map((question, index) => (
                    <Text
                      key={`q-${index}`}
                      className="text-sm text-foreground"
                    >
                      • {question}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

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
                  Our AI will analyze your notes and create summaries, key
                  points, and generate practice questions.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
function ensureVisionMimeType(mimeType: string | undefined, fileName: string): string {
  if (mimeType) return mimeType;

  const normalized = fileName.trim().toLowerCase();

  if (normalized.endsWith(".pdf")) return "application/pdf";
  if (normalized.endsWith(".txt")) return "text/plain";
  if (normalized.endsWith(".doc")) return "application/msword";
  if (normalized.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (normalized.endsWith(".pptx"))
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) return "image/jpeg";
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".webp")) return "image/webp";
  if (normalized.endsWith(".gif")) return "image/gif";
  if (normalized.endsWith(".heic")) return "image/heic";

  return "application/octet-stream";
}

