import {Text, StyleSheet, View} from 'react-native';
import {Card, useTheme} from 'react-native-paper';
import React, {useState} from "react";
import ProgressCircle from 'progress-circle-react-native'
import {showImage} from "../services/imageService";
import FastImage from 'react-native-fast-image';

const Goal = ({
                  title, description, activity, unit, objective, progress,
                  timeLimit, onSelectedChange, changedSelection, image
              }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [selected, setSelected] = useState(false);

    const cardStyle = selected ? {
        ...styles.card,
        backgroundColor: theme.colors.background,
        borderWidth: 3,
        borderColor: theme.colors.primary,
    } : {
        ...styles.card,
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
    }

    const handlePress = () => {
        if (changedSelection) {
            handleLongPress();
        } else {
            if (selected) {
                setSelected(false);
                onSelectedChange(false);
                return;
            }
            setExpanded(!expanded);
        }
    }

    const handleLongPress = () => {
        setSelected(!selected);
        onSelectedChange(!selected);
    }

    return (
        <Card style={cardStyle} onPress={handlePress} onLongPress={handleLongPress}>
            <Card.Content>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <View>
                        <Text style={{
                            ...styles.title,
                            color: theme.colors.secondary,
                        }}>{title}</Text>
                        {expanded && (
                            <View>
                                <Text style={{
                                    ...styles.description,
                                    color: theme.colors.tertiary,
                                }}>{description}</Text>
                                <Text style={{
                                    color: theme.colors.secondary,
                                    marginTop: 10,
                                    fontSize: 18,
                                }}>
                                    {activity}
                                </Text>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: 16,
                                }}>
                                    Current: {progress} {unit}
                                </Text>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: 16,
                                }}>
                                    Objective: {objective} {unit}
                                </Text>
                                {timeLimit && (
                                    <Text style={{
                                        ...styles.description,
                                        color: theme.colors.tertiary,
                                        marginTop: 10,
                                    }}>Finishes on {timeLimit}</Text>
                                )}
                                {image &&
                                    <FastImage 
                                        source={{
                                            uri: showImage(image),
                                            priority: FastImage.priority.normal
                                        }}
                                        style={{
                                            width: 120,
                                            height: 120,
                                            marginTop: 10,
                                            borderRadius: 5
                                        }}
                                    />
                                }
                            </View>
                        )}
                    </View>
                    <View style={{flexDirection: "row"}}>
                        {!expanded && (
                            <Text style={{
                                color: theme.colors.secondary,
                                fontSize: 18,
                                marginRight: 10,
                                marginTop: 2,
                            }}>{`${(progress / objective * 100).toFixed(0)}%`}</Text>
                        )}
                        <ProgressCircle
                            percent={progress / objective * 100}
                            radius={expanded ? 50 : 15}
                            borderWidth={expanded ? 8 : 4}
                            color={theme.colors.secondary}
                            bgColor={theme.colors.background}
                            shadowColor={theme.colors.primary}
                        >
                            {expanded && (
                                <Text style={{
                                    fontSize: 20,
                                    color: theme.colors.secondary
                                }}>{`${(progress / objective * 100).toFixed(0)}%`}</Text>
                            )}
                        </ProgressCircle>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: 'gray',
    },
});

export default Goal;
