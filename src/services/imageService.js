import {decode} from 'base-64';
import * as ImagePicker from "expo-image-picker";
import RNFetchBlob from "react-native-blob-util";

export const pickImageFromGallery = async() => {
    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,4],
            quality: 1,
            allowsMultipleSelection: false,
        });
        return result.canceled ? null : result.assets[0].uri;
    } catch(e) {
        throw new Error("Cannot pick image", e);
    }
}

export const encodeImage = async(uri) => {
    if (!uri) return null;
    try {
        const base64data = await RNFetchBlob.fs.readFile(uri, 'base64');
        return base64data || null;
    } catch(e) {
        throw new Error("Cannot encode Image: " + uri, e);
    }
}

export const showImage = (uri) => {
    if (!uri) return null;
    if (uri.startsWith('data:')) return uri;
    try {
        const oldImage = decode(uri);
        return oldImage;
    } catch(e) {
        console.log("Cannot decode image: " + uri, e);
    } finally {
        return 'data:image/jpeg;base64,' + uri;
    }
   
}