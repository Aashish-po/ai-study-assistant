# AI Study Assistant - Mobile App Design

## Overview

A comprehensive study companion app that leverages AI to help students prepare for exams through intelligent note summarization, question generation, past paper prediction, and adaptive revision planning.

## Screen List

1. **Home Screen** - Dashboard with quick access to all features
2. **Upload Notes Screen** - Upload study materials (PDF, images, text)
3. **Summarization Screen** - View AI-generated summaries with key points
4. **Quiz Screen** - MCQ and long-form question practice
5. **Past Paper Prediction** - AI-predicted likely exam questions
6. **Revision Planner Screen** - Smart study schedule and progress tracking
7. **Voice Explanation Screen** - Listen to AI-generated voice explanations
8. **Study History Screen** - View past sessions and performance metrics
9. **Settings Screen** - App preferences and account management

## Primary Content and Functionality

### Home Screen
- **Content**: Welcome message, quick action buttons, recent study sessions
- **Functionality**: 
  - Quick access buttons: "Upload Notes", "Start Quiz", "View Revision Plan", "Voice Mode"
  - Display recent documents and study sessions
  - Show study streak and daily goals

### Upload Notes Screen
- **Content**: File picker, text input area, document preview
- **Functionality**:
  - Upload PDF, images, or paste text
  - Preview uploaded content
  - Select subject/topic
  - Trigger AI summarization on upload

### Summarization Screen
- **Content**: Original notes (collapsible), AI summary, key points list, flashcards
- **Functionality**:
  - Display AI-generated summary with highlighted key concepts
  - Extract and display key points as bullet list
  - Generate flashcards from summary
  - Share or export summary
  - Bookmark for later review

### Quiz Screen
- **Content**: Question display, multiple choice options, timer, progress bar
- **Functionality**:
  - Display MCQs with 4 options
  - Show long-form questions with text input
  - Timer for timed quizzes
  - Immediate feedback (correct/incorrect)
  - Performance analytics (score, accuracy, time per question)
  - Review answers and explanations

### Past Paper Prediction Screen
- **Content**: Predicted questions list, confidence scores, topic tags
- **Functionality**:
  - Display AI-predicted likely exam questions
  - Show confidence percentage for each prediction
  - Filter by topic/subject
  - Practice predicted questions
  - Track which predictions were correct in actual exams

### Revision Planner Screen
- **Content**: Calendar view, study schedule, progress bars, milestone tracking
- **Functionality**:
  - Display personalized study schedule
  - Show daily study goals and time allocation
  - Track completion status for each topic
  - Suggest optimal revision timing based on spaced repetition
  - Show progress toward exam date

### Voice Explanation Screen
- **Content**: Audio player, transcript, playback controls, speed adjustment
- **Functionality**:
  - Play AI-generated voice explanations for concepts
  - Adjust playback speed (0.75x, 1x, 1.25x, 1.5x)
  - Display transcript alongside audio
  - Download for offline listening
  - Bookmark important explanations

### Study History Screen
- **Content**: Session list, performance charts, statistics
- **Functionality**:
  - View all past study sessions with timestamps
  - Display performance metrics (scores, accuracy trends)
  - Filter by subject/date range
  - Export study reports

### Settings Screen
- **Content**: Preferences, account info, notifications, app info
- **Functionality**:
  - Dark/light mode toggle
  - Notification preferences
  - Account settings
  - About app and version info

## Key User Flows

### Flow 1: Upload and Summarize Notes
1. User taps "Upload Notes" on home screen
2. Selects file (PDF/image) or pastes text
3. Selects subject/topic
4. App sends to backend for AI summarization
5. User views summary with key points and flashcards
6. User can bookmark, share, or generate quiz from summary

### Flow 2: Practice Quiz
1. User taps "Start Quiz" on home screen
2. Selects subject and quiz type (MCQ/Long-form)
3. App displays questions one by one
4. User answers and gets immediate feedback
5. After quiz completion, user sees score and performance breakdown
6. User can review answers and explanations

### Flow 3: Past Paper Prediction
1. User navigates to "Past Paper Prediction"
2. Selects exam/subject
3. Views AI-predicted likely questions with confidence scores
4. User can practice predicted questions
5. After exam, user marks which predictions were correct

### Flow 4: Smart Revision Planning
1. User sets exam date and subjects
2. App generates personalized revision schedule
3. User views daily study goals and time allocation
4. User completes daily tasks and marks them done
5. App adjusts schedule based on progress and spaced repetition principles

### Flow 5: Voice Explanations
1. User selects a concept or question
2. Taps "Listen Explanation"
3. Audio player opens with AI-generated voice explanation
4. User can adjust speed, view transcript, or download

## Color Choices

### Primary Brand Colors
- **Primary Blue**: `#0a7ea4` - Main action buttons, highlights, accents
- **Success Green**: `#22C55E` - Correct answers, completed tasks, progress indicators
- **Warning Orange**: `#F59E0B` - Pending tasks, important reminders
- **Error Red**: `#EF4444` - Incorrect answers, failed attempts, errors

### Neutral Colors
- **Background**: `#ffffff` (light) / `#151718` (dark)
- **Surface**: `#f5f5f5` (light) / `#1e2022` (dark)
- **Foreground**: `#11181C` (light) / `#ECEDEE` (dark)
- **Muted**: `#687076` (light) / `#9BA1A6` (dark)
- **Border**: `#E5E7EB` (light) / `#334155` (dark)

### Semantic Colors
- **Correct**: `#22C55E` (green) for correct answers
- **Incorrect**: `#EF4444` (red) for wrong answers
- **Pending**: `#F59E0B` (orange) for incomplete tasks
- **Info**: `#0a7ea4` (blue) for information messages

## Typography & Spacing

- **Headings**: Bold, 24-28px (screen titles)
- **Subheadings**: Semibold, 18-20px (section titles)
- **Body Text**: Regular, 14-16px (main content)
- **Captions**: Regular, 12-13px (labels, hints)
- **Spacing**: 8px base unit (8, 16, 24, 32px gaps)

## Interaction Patterns

- **Buttons**: Tap with haptic feedback, scale animation (0.97x)
- **Lists**: Swipe to delete, long-press for options
- **Forms**: Keyboard dismissal on submit, validation feedback
- **Navigation**: Tab bar at bottom for main sections, back button in header
- **Loading**: Skeleton screens for content loading, spinner for actions
- **Feedback**: Toast notifications for actions, haptic feedback for confirmations
