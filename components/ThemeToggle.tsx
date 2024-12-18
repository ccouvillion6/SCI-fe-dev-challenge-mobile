import { useCustomColorScheme } from '@/context/ThemeContext';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { StyleSheet } from 'react-native';

export function ThemeToggle() {
    const { theme, setTheme } = useCustomColorScheme();
  
    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    };
  
    return (
        <SegmentedControl
        values={['Light', 'Dark']}
        selectedIndex={theme === 'dark' ? 1 : 0}
        onChange={toggleTheme}
        style={styles.segmentedControl}
    />
    );
  }

  const styles = StyleSheet.create({
    segmentedControl: {
        width: 150,
        height: 32,
    },
});