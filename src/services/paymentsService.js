import {axiosInstance} from "./config/axiosConfig";
import requests from "../consts/requests";
import utils from "../utils/Utils";

const paymentsService = {
    async getWallet() {
        try {
            let userId = await utils.getUserId();
            const response =
                await axiosInstance.get(`${requests.USER}/${userId}${requests.WALLET}`);
            return response.data?.address;
        } catch (error) {
            console.log(error);
        }
    },

    async getBalance() {
        try {
            let userId = await utils.getUserId();
            const response =
                await axiosInstance.get(`${requests.USER}/${userId}${requests.WALLET}${requests.BALANCE}`);
            return response.data?.balance.balance;
        } catch (error) {
            console.log(error);
        }
    },

    async transfer(receiverId, amount) {
        try {
            let userId = await utils.getUserId();
            let body = {
                receiver_id: receiverId,
                sender_id: parseInt(userId),
                amount: parseFloat(amount)
            }
            const response = await axiosInstance.post(requests.DEPOSIT, body);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}

export default paymentsService;
