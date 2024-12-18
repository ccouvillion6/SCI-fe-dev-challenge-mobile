import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type SkeletonProps = {
  width?: number | string;
  height?: number;
  style?: any;
};

export function Skeleton({ width = '100%', height = 20, style }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const backgroundColor = useThemeColor({}, 'background');
  const highlightColor = useThemeColor({}, 'text');

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  const animatedStyle = {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [backgroundColor, highlightColor],
    }),
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.3],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        animatedStyle,
        { width, height },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
  },
});