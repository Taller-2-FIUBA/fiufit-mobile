import {Button, Paragraph, Portal, Dialog, useTheme} from "react-native-paper";
import React from "react";
import {View} from "react-native";

const FiufitDialog = ({visible, title, content, isOk, onDismiss, handleConfirm, handleCancel, handleOk}) => {
    const theme = useTheme();

    return (
        <Portal>
            <Dialog visible={visible}
                    onDismiss={onDismiss}
                    style={{
                        backgroundColor: theme.colors.background,
                        borderWidth: 1,
                        borderColor: theme.colors.secondary,
                    }}>

                <Dialog.Title
                    style={{
                        color: theme.colors.secondary,
                    }}>{title}</Dialog.Title>

                <Dialog.Content>
                    <Paragraph
                        style={{
                            color: theme.colors.tertiary,
                        }}
                    >{content}</Paragraph>
                </Dialog.Content>

                <Dialog.Actions style={{
                    justifyContent: 'space-around',
                }}>
                    {isOk ?
                        (
                            <Button onPress={handleOk}
                                    textColor={theme.colors.secondary}
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        width: 120,
                                        borderWidth: 1,
                                        borderColor: theme.colors.secondary
                                    }}
                            >Confirm</Button>
                        )
                        :
                        (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                }}>
                                <Button onPress={handleConfirm}
                                        textColor={theme.colors.secondary}
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            flex: 1,
                                            marginRight: 10,
                                            borderWidth: 1,
                                            borderColor: theme.colors.secondary,
                                        }}
                                >Confirm</Button>
                                <Button onPress={handleCancel}
                                        textColor={theme.colors.background}
                                        style={{
                                            backgroundColor: theme.colors.primary,
                                            flex: 1,
                                            marginLeft: 10,
                                        }}
                                >Cancel</Button>
                            </View>
                        )
                    }
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default FiufitDialog;
