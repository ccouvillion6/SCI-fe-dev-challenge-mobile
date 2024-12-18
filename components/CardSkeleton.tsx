import React from 'react';
import { StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { ThemedView } from './ThemedView';
import { useCustomColorScheme } from '@/context/ThemeContext';

export default function CardSkeleton() {
    const { theme } = useCustomColorScheme();
    const styles = getStyles(theme);

    return (
        <ThemedView style={styles.card}>
            <ThemedView style={styles.imageContainer}>
                <Skeleton style={styles.image} />
            </ThemedView>
            <ThemedView style={styles.content}>
                <Skeleton style={[styles.title, { width: '80%' }]} />
                <Skeleton style={[styles.detail, { width: '50%' }]} />
                <Skeleton style={[styles.detail, { width: '30%' }]} />
                <Skeleton style={[styles.detail, { width: '20%' }]} />
            </ThemedView>
        </ThemedView>
    );
}

const getStyles = (theme: string) => StyleSheet.create({
    card: {
        backgroundColor: theme === 'light' ? '#FFFFFF' : '#1F2937',
        borderRadius: 8,
        padding: 8,
        margin: 8,
        flexDirection: 'row',
        shadowColor: theme === 'light' ? '#000' : '#FFFFFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageContainer: {
        width: 120,
        height: 120,
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        height: 18,
        marginBottom: 4,
    },
    detail: {
        height: 14,
        marginBottom: 2,
    },
});