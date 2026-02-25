import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'book.fill': 'book',
  'play.circle.fill': 'play-circle',
  'person.fill': 'person',
  'magnifyingglass': 'search',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  'calendar': 'calendar-today',
  'bell.fill': 'notifications',
  'gear': 'settings',
  'star.fill': 'star',
  'lightbulb.fill': 'lightbulb',
  'brain': 'psychology',
  'camera.fill': 'photo-camera',
  'cloud.upload.fill': 'cloud-upload',
  'doc.text.fill': 'description',
  'speaker.wave.2.fill': 'volume-up',
} as const;

type IconSymbolName = keyof typeof MAPPING;

type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function IconSymbol({ name, size = 24, color = 'black', style }: IconSymbolProps) {
  return (
    <MaterialIcons
      name={MAPPING[name]}
      size={size}
      color={color}
      style={style}
    />
  );
}
