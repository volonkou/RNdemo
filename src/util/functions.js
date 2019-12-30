import {AsyncStorage,PixelRatio} from 'react-native';
import Storage from 'react-native-storage';

const Dimensions = require("Dimensions");
export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;
export const PX=1/PixelRatio.get();

export const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true
})


export const setToken = (token) => {
    storage.save({
        key: "token",
        data: token
    })
}

export const removeToken = () => {
    storage.remove({
        key: 'token'
    });
}