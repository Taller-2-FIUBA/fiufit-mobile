import React, {useEffect, useState} from "react";
import paymentsService from "../services/paymentsService";
import {Modal, Portal, useTheme} from "react-native-paper";
import {ScrollView, Text, View} from "react-native";
import BalanceCard from "../components/BalanceCard";
import {fiufitStyles} from "../consts/fiufitStyles";
import FiufitDialog from "../components/FiufitDialog";
import PaymentsFAB from "../components/PaymentsFAB";
import TransferScreen from "./TransferScreen";
import {validateAmount, validateTransferUsername} from "../utils/validations";
import {UserService as userService} from "../services/userService";

const PaymentsScreen = () => {
    const theme = useTheme();

    // User data
    const [balance, setBalance] = useState('');
    const [wallet, setWallet] = useState('');

    // Transfer data
    const [transferReceiverUsername, setTransferReceiverUsername] = useState('');
    const [transferAmount, setTransferAmount] = useState('');

    // Dialog
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogIsOk, setDialogIsOk] = useState(false);

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([getBalance(), getWallet()])
            .then(() => {
                    setLoading(false);
                }
            );
    }, []);

    const recalculateBalance = () => {
        setLoading(true);
        getBalance().then(() => setLoading(false));
    }

    const getBalance = async () => {
        try {
            let amount = await paymentsService.getBalance();
            setBalance(amount);
        } catch (error) {
            console.error(error);
        }
    };

    const getWallet = async () => {
        try {
            let address = await paymentsService.getWallet();
            setWallet(address);
        } catch (error) {
            console.error(error);
        }
    }

    const validateTransfer = () => {
        if (!validateTransferUsername(transferReceiverUsername, false)) {
            setDialog('Invalid username', 'Please enter a valid username', true);
            return false;
        }
        if (!validateAmount(transferAmount, false)) {
            setDialog('Invalid amount', 'Please enter a valid amount', true);
            return false;
        }
        return true;
    }

    const resetForm = () => {
        setTransferReceiverUsername('');
        setTransferAmount('');
    }

    const getReceiverId = async () => {
        let user = await userService.getUserByUsername(transferReceiverUsername);
        return user?.id;
    }

    const transfer = async () => {
        try {
            if (loading) return;
            if (!validateTransfer()) {
                setVisible(true);
                return;
            }
            setVisible(false);
            hideModal();
            let receiverId = await getReceiverId();
            if (!receiverId) {
                setDialog('User not found', 'Please enter a valid username', true);
                resetForm();
                setVisible(true);
                return;
            }
            await paymentsService.transfer(receiverId, transferAmount);
            recalculateBalance();
        } catch (error) {
            console.error(error);
            resetDialog();
            setVisible(true);
        }
    }

    const setDialog = (title, content, isOk) => {
        setDialogTitle(title);
        setDialogContent(content);
        setDialogIsOk(isOk);
    }

    const resetDialog = () => {
        setDialog('Error',
            'An error has occurred, please try again later',
            true);
    }

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background, paddingVertical: 15}}>
            <ScrollView>
                <BalanceCard balance={balance} wallet={wallet} loading={loading}/>

                <View style={fiufitStyles.FABContainer}>
                    <PaymentsFAB label={'Withdraw'} iconName={'arrow-collapse-down'}
                                 onPress={() => console.log("Not implemented")}/>
                    <PaymentsFAB label={'Transfer'} iconName={'arrow-top-right'}
                                 onPress={showModal}/>
                    <PaymentsFAB label={'Reload'} iconName={'refresh'}
                                 onPress={recalculateBalance}/>
                </View>

                <Text style={fiufitStyles.hintStyle}>
                    You can withdraw your balance to another wallet or transfer it to another user!
                </Text>
            </ScrollView>
            <Portal>
                <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={fiufitStyles.containerStyle}>
                    <TransferScreen
                        user={transferReceiverUsername}
                        amount={transferAmount}
                        setUser={setTransferReceiverUsername}
                        setAmount={setTransferAmount}
                        onConfirm={() => {
                            setDialog('Transfer',
                                'Are you sure you want to make the transfer?',
                                false)
                            setVisible(true)
                        }}
                        onCancel={() => {
                            hideModal();
                            resetForm();
                            resetDialog();
                        }}
                    />
                </Modal>
                <FiufitDialog
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    title={dialogTitle}
                    content={dialogContent}
                    isOk={dialogIsOk}
                    handleConfirm={dialogIsOk ? hideModal : transfer}
                    handleCancel={() => setVisible(false)}
                    handleOk={() => setVisible(false)}
                />
            </Portal>
        </View>
    );
}

export default PaymentsScreen;
