import {axiosInstance} from "./config/axiosConfig";
import requests from "../consts/requests";
import utils from "../utils/Utils";

const paymentsService = {
    async getWallet() {
        try {
            let userId = await utils.getUserId();
            const response =
                await axiosInstance.get(`${requests.USER}/${userId}${requests.WALLET}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    async deposit(receiverId, amount) {
        try {
            let userId = await utils.getUserId();
            let body = {
                receiverId: receiverId,
                senderId: userId,
                amount: amount
            }
            const response = await axiosInstance.post(requests.DEPOSIT, body);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
}
