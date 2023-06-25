import {axiosInstance} from "./config/axiosConfig";
import requests from "../consts/requests";
import utils from "../utils/Utils";

const paymentsService = {
    async getWallet() {
        let userId = await utils.getUserId();
        const response =
            await axiosInstance.get(`${requests.USER}/${userId}${requests.WALLET}`);
        return response.data?.address;
    },

    async getBalance() {
        let userId = await utils.getUserId();
        const response =
            await axiosInstance.get(`${requests.USER}/${userId}${requests.WALLET}${requests.BALANCE}`);
        return response.data?.balance.balance;
    },

    async transfer(receiverId, amount) {
        let userId = await utils.getUserId();
        let body = {
            receiver_id: receiverId,
            sender_id: parseInt(userId),
            amount: parseFloat(amount)
        }
        const response = await axiosInstance.post(requests.DEPOSIT, body);
        return response.data;
    },

    async withdraw(wallet, amount) {
        let userId = await utils.getUserId();
        let body = {
            receiver_address: wallet,
            sender_id: parseInt(userId),
            amount: parseFloat(amount)
        }
        const response = await axiosInstance.post(requests.WITHDRAW, body);
        return response.data;
    }
}

export default paymentsService;
