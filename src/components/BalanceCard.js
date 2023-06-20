import {Card, useTheme, Text, ActivityIndicator} from "react-native-paper";
import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Clipboard from 'expo-clipboard';

const BalanceCard = ({balance, wallet, loading}) => {
    const theme = useTheme();

    const [showBalance, setShowBalance] = useState(false);

    const toggleShowBalance = () => {
        setShowBalance(!showBalance);
    };

    const handleCopyWallet = async () => {
        if (wallet) {
            await Clipboard.setStringAsync(wallet);
        }
    };

    return (
        <Card style={{margin: 16, paddingVertical: 16, borderRadius: 16, backgroundColor: theme.colors.primary}}>

            {loading ? (
                <View style={{
                    paddingVertical: 70,

                }}>
                    <ActivityIndicator size={'small'} color={theme.colors.secondary} style={{flex: 1}}/>
                </View>
            ) : (
                <View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                    }}>
                        <View>
                            <Text style={{
                                color: theme.colors.secondary,
                                fontSize: 24,
                                fontWeight: 'bold'
                            }}>
                                Balance
                            </Text>
                            <Text style={{
                                color: theme.colors.tertiary,
                                fontSize: 16,
                            }}>
                                Your current balance
                            </Text>
                        </View>
                        <TouchableOpacity onPress={toggleShowBalance}
                                          style={{
                                              marginLeft: 'auto',
                                              backgroundColor: theme.colors.secondary,
                                              borderRadius: 16,
                                              padding: 8,
                                              elevation: 4
                                          }}>
                            <Icon name={showBalance ? 'eye' : 'eye-off'} size={24} color={theme.colors.primary}/>
                        </TouchableOpacity>
                    </View>
                    <Card.Content>
                        <Card.Title title={showBalance ? `$ ${balance}` : '********'}
                                    titleStyle={{
                                        marginTop: 5,
                                        color: theme.colors.secondary,
                                        fontSize: 24,
                                        fontWeight: 'bold'
                                    }}
                        />
                    </Card.Content>
                    {
                        wallet &&
                        <Card.Content>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <View>
                                    <Text style={{color: theme.colors.secondary}}>
                                        Wallet address
                                    </Text>
                                    <Text style={{
                                        color: theme.colors.tertiary,
                                        width: 246,
                                    }}>
                                        {wallet}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={handleCopyWallet} style={{marginTop: 16, marginLeft: 15}}>
                                    <Icon name="content-copy" size={24} color={theme.colors.tertiary}/>
                                </TouchableOpacity>
                            </View>
                        </Card.Content>
                    }
                </View>
            )}
        </Card>
    )
        ;
}

export default BalanceCard;
