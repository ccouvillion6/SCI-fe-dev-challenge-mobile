import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import { searchCards } from '../api/api';
import { Colors } from '../constants/Colors';
import { useCustomColorScheme } from '@/context/ThemeContext';
import CardSkeleton from './CardSkeleton';
import { Skeleton } from './Skeleton';

type CardData = {
    set: string;
    number: string;
    name: string;
    type: string;
    aspects: string[];
    traits: string[];
    arenas: string[];
    cost: number;
    power: number;
    hp: string;
    fronttext: string;
    doublesided: boolean;
    rarity: string;
    unique: boolean;
    artist: string;
    varianttype: string;
    marketprice: string;
    foilprice: string;
    frontArt: string;
    id: string;
};

type CardListProps = {
    hp: string;
};

export default function CardList({ hp }: CardListProps) {
    const [cards, setCards] = useState<CardData[]>([]);
    const [displayedCards, setDisplayedCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useCustomColorScheme();
    const styles = getStyles(theme);
    const [sortKey, setSortKey] = useState<keyof CardData>('Name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const ITEMS_PER_PAGE = 10;

    // Update displayed cards when cards array or page changes
    useEffect(() => {
        const endIndex = currentPage * ITEMS_PER_PAGE;
        setDisplayedCards(cards.slice(0, endIndex));
    }, [cards, currentPage]);

    useEffect(() => {
        if (!hp) return;

        const fetchCardData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await searchCards(hp, sortKey, sortDirection);
                const formattedCards = Array.isArray(result.data)
                    ? result.data.map((card: any) => ({
                        set: card.Set,
                        number: card.Number,
                        name: card.Name,
                        type: card.Type,
                        aspects: card.Aspects,
                        traits: card.Traits,
                        arenas: card.Arenas,
                        cost: card.Cost,
                        power: card.Power,
                        hp: card.HP,
                        fronttext: card.FrontText,
                        doublesided: card.DoubleSided,
                        rarity: card.Rarity,
                        unique: card.Unique,
                        artist: card.Artist,
                        varianttype: card.VariantType,
                        marketprice: card.MarketPrice,
                        foilprice: card.FoilPrice,
                        frontArt: card.FrontArt,
                        id: `${card.Set}-${card.Number}`
                    }))
                    : [];

                setCards(formattedCards);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setCards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCardData();
    }, [hp, sortKey, sortDirection]);

    const loadMoreCards = () => {
        if (loadingMore) return;
        if (displayedCards.length >= cards.length) return;

        setLoadingMore(true);
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <CardSkeleton />
            </View>
        );
    };

    function sortCards(key: keyof CardData) {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }

    const renderSortButton = (label: string, key: keyof CardData, color: string) => (
        <TouchableOpacity
            style={[styles.sortButton, { backgroundColor: color }]}
            onPress={() => sortCards(key)}
        >
            <Text style={styles.sortButtonText}>Sort by {label} {sortKey === key ? sortDirection === 'asc' ? '↑' : '↓' : ''}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.sortButtons}>
                    {/* Skeleton for sort buttons */}
                    <View style={styles.sortButtons}>
                        <Skeleton width={100} height={40} style={styles.sortButton} />
                        <Skeleton width={100} height={40} style={styles.sortButton} />
                        <Skeleton width={100} height={40} style={styles.sortButton} />
                        <Skeleton width={100} height={40} style={styles.sortButton} />
                    </View>
                </View>
                <FlatList
                    data={[1, 2, 3, 4, 5]} // Number of skeleton items to show
                    renderItem={() => <CardSkeleton />}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.sortButtons}>
                {renderSortButton('Name', 'name', '#3B82F6')}
                {renderSortButton('Set', 'set', '#10B981')}
                {renderSortButton('Cost', 'cost', '#8B5CF6')}
                {renderSortButton('Power', 'power', '#EF4444')}
            </View>
            <FlatList
                data={displayedCards}
                renderItem={({ item }) => <Card {...item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMoreCards}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}

const getStyles = (scheme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors[scheme].background,
    },
    sortButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 8,
    },
    sortButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 100,
    },
    sortButtonText: {
        color: Colors[scheme].text,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 16,
    },
    messageText: {
        textAlign: 'center',
        color: Colors[scheme].text,
        fontSize: 16,
        padding: 16,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
        padding: 16,
    },
    footerLoader: {
        marginVertical: 16,
    },
});