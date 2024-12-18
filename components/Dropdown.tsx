import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchCatalog } from '../api/api';

type DropdownProps = {
    onSelect: (selectedValue: string) => void;
};

export default function Dropdown({ onSelect }: DropdownProps) {
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const colorScheme = useColorScheme() ?? 'light';
    const styles = getStyles(colorScheme);

    useEffect(() => {
        async function loadOptions() {
            try {
                const result = await fetchCatalog();
                setOptions(result.data);
                setLoading(false);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            }
        }

        loadOptions();
    }, []);

    if (loading) {
        return <Text style={styles.loadingText}>Loading options...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => {
                    setSelectedValue(itemValue);
                    onSelect(itemValue);
                }}
                style={styles.picker}
            >
                <Picker.Item label="Select HP" value="" />
                {options.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                ))}
            </Picker>
        </View>
    );
}

const getStyles = (scheme: 'light' | 'dark') => StyleSheet.create({
    container: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: scheme === 'dark' ? '#4B5563' : '#E5E7EB',
        borderRadius: 8,
        backgroundColor: scheme === 'dark' ? '#F3F4F6' : '#374151',
    },
    picker: {
        color: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
        height: 50,
    },
    loadingText: {
        textAlign: 'center',
        color: scheme === 'dark' ? '#1F2937' : '#FFFFFF',
        padding: 10,
    },
    errorText: {
        textAlign: 'center',
        color: '#EF4444',
        padding: 10,
    },
});