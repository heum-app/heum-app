import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

interface FAQAccordionProps {
  title: string;
  content: string;
  isLast?: boolean;
}

export function FAQAccordion({ title, content, isLast }: FAQAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    const nextState = !expanded;
    setExpanded(nextState);
    Animated.timing(animation, {
      toValue: nextState ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container, isLast && styles.lastContainer]}>
      <Pressable style={styles.header} onPress={toggleAccordion}>
        <Text style={[styles.title, expanded && styles.titleExpanded]}>{title}</Text>
        <Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={20} color="#BFC4CB" />
      </Pressable>

      <View
        style={styles.hiddenContent}
        onLayout={(e: LayoutChangeEvent) => setContentHeight(e.nativeEvent.layout.height)}
        pointerEvents="none"
      >
        <Text style={styles.content}>{content}</Text>
      </View>

      <Animated.View
        style={{
          height:
            contentHeight > 0
              ? animation.interpolate({ inputRange: [0, 1], outputRange: [0, contentHeight] })
              : 0,
          overflow: 'hidden',
        }}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  lastContainer: {
    borderBottomWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  titleExpanded: {
    color: '#111827',
    fontWeight: '600',
  },
  hiddenContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    paddingBottom: 16,
    paddingRight: 32,
    zIndex: -1,
  },
  contentContainer: {
    paddingBottom: 16,
    paddingRight: 32,
  },
  content: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
});
