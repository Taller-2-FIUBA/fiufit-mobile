import React, {useEffect, useState} from "react";
import paymentsService from "../services/paymentsService";
import {Modal, Portal, useTheme} from "react-native-paper";
import {ScrollView, Text, View} from "react-native";
import BalanceCard from "../components/BalanceCard";
import {fiufitStyles} from "../consts/fiufitStyles";
import FiufitDialog from "../components/FiufitDialog";
import PaymentsFAB from "../components/PaymentsFAB";
import TransferScreen from "./TransferScreen";
import {validateAmount, validateTransferUsername, validateWallet} from "../utils/validations";
import {UserService as userService} from "../services/userService";
import WithdrawScreen from "./WithdrawScreen";

const PaymentsScreen = () => {
    const theme = useTheme();

    // User data
    const [balance, setBalance] = useState('');
    const [wallet, setWallet] = useState('');

    // Transfer data
    const [transferReceiver, setTransferReceiver] = useState('');
    const [transferAmount, setTransferAmount] = useState('');

    // Dialog
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogIsOk, setDialogIsOk] = useState(false);

    // Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [isWithdraw, setIsWithdraw] = useState(false);
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

    const recalculateBalance = async () => {
        let retries = 0;
        let currentBalance = parseFloat(balance);
        while (currentBalance === parseFloat(balance) && retries < 15) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await getBalance();
            retries++;
        }
        setLoading(false);
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
        if (!isWithdraw) {
            if (!validateTransferUsername(transferReceiver, false)) {
                setDialog('Invalid username', 'Please enter a valid username', true);
                return false;
            }
        } else {
            if (!validateWallet(transferReceiver, false)) {
                setDialog('Invalid wallet', 'Please enter a valid wallet', true);
                return false;
            }
        }

        if (!validateAmount(transferAmount, false)) {
            setDialog('Invalid amount', 'Please enter a valid amount', true);
            return false;
        }
        return true;
    }

    const resetForm = () => {
        setTransferReceiver('');
        setTransferAmount('');
        setIsWithdraw(false);
    }

    const getReceiverId = async () => {
        let user = await userService.getUserByUsername(transferReceiver);
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
            setLoading(true);
            let receiverId = await getReceiverId();
            if (!receiverId) {
                setDialog('User not found', 'Please enter a valid username', true);
                resetForm();
                setVisible(true);
                return;
            }
            Promise.all([paymentsService.transfer(receiverId, transferAmount), recalculateBalance()])
                .then(() => {
                    setLoading(false);
                    resetForm();
                });
        } catch (error) {
            console.error(error);
            resetDialog();
            setVisible(true);
        }
    }

    const withdraw = async () => {
        try {
            if (loading) return;
            if (!validateTransfer()) {
                setVisible(true);
                return;
            }
            setVisible(false);
            hideModal();
            setLoading(true);
            Promise.all([paymentsService.withdraw(transferReceiver, transferAmount), recalculateBalance()])
                .then(() => {
                    setLoading(false);
                    resetForm();
                });
        } catch (error) {
            console.error(error);
            resetDialog();
            resetForm();
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
        resetForm();
    }

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background, paddingVertical: 15}}>
            <ScrollView>
                <BalanceCard balance={balance} wallet={wallet} loading={loading}/>

                <View style={fiufitStyles.FABContainer}>
                    <PaymentsFAB label={'Withdraw'} iconName={'arrow-collapse-down'}
                                 onPress={() => {
                                     if (loading) return;
                                     setIsWithdraw(true);
                                     showModal();
                                 }}/>
                    <PaymentsFAB label={'Transfer'} iconName={'arrow-top-right'}
                                 onPress={() => {
                                     if (loading) return;
                                     showModal();
                                 }}/>
                    <PaymentsFAB label={'Reload'} iconName={'refresh'}
                                 onPress={() => {
                                     if (loading) return;
                                     setLoading(true);
                                     getBalance().then(() => setLoading(false));
                                 }}/>
                </View>

                <Text style={fiufitStyles.hintStyle}>
                    You can withdraw your balance to another wallet or transfer it to another user!
                </Text>
            </ScrollView>
            <Portal>
                <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={fiufitStyles.containerStyle}>
                    {isWithdraw ? (
                        <WithdrawScreen
                            wallet={transferReceiver}
                            amount={transferAmount}
                            setWallet={setTransferReceiver}
                            setAmount={setTransferAmount}
                            onConfirm={() => {
                                setDialog('Withdraw',
                                    'Are you sure you want to withdraw?',
                                    false);
                                setVisible(true);
                            }}
                            onCancel={() => {
                                hideModal();
                                resetForm();
                                resetDialog();
                            }}
                        />
                    ) : (
                        <TransferScreen
                            user={transferReceiver}
                            amount={transferAmount}
                            setUser={setTransferReceiver}
                            setAmount={setTransferAmount}
                            onConfirm={() => {
                                setDialog('Transfer',
                                    'Are you sure you want to make the transfer?',
                                    false);
                                setVisible(true);
                            }}
                            onCancel={() => {
                                hideModal();
                                resetForm();
                                resetDialog();
                            }}
                        />
                    )}
                </Modal>
                <FiufitDialog
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    title={dialogTitle}
                    content={dialogContent}
                    isOk={dialogIsOk}
                    handleConfirm={dialogIsOk ? hideModal : (isWithdraw ? withdraw : transfer)}
                    handleCancel={() => setVisible(false)}
                    handleOk={() => setVisible(false)}
                />
            </Portal>
        </View>
    );
}

export default PaymentsScreen;
