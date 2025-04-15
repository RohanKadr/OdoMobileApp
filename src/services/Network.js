import axios from "axios";
import { BASE_URL, PATH, Services } from "./UrlConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const rootApi = axios.create({
//     baseURL: PATH.BASE_URL,
//     headers: { 'Content-Type': 'application/json' },
//     timeout: 1000,
// });

const genericWmsApi = axios.create({
    baseURL: PATH.URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

genericWmsApi.interceptors.request.use(async (config) => {
    const sessionKey = await AsyncStorage.getItem('sessionKey');
    if (sessionKey) {
        config.headers['key'] = sessionKey;
    }
    return config;
});

genericWmsApi.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.reponse?.status === 401) {
            await AsyncStorage.removeItem('sessionKey');
        }
        return Promise.reject(error);
    }
);

export const getDataUsingService = (service) => {
    return new Promise(async (resolve, reject) => {
        console.log('BASE_URL==>', PATH.URL + service);
        axios
            .get(PATH.URL + service)
            .then(function (response) {
                // handle success
                console.log('RESPONSE ==>', response.data);
                resolve(response.data);
            })
            .catch(function (error) {
                // handle error
                consoleError('EXCEPTION ==>', error);
                reject(error.message);
            })
    });
};

//login ...
export const login = async (username, password) => {
        console.log('BASE_URL==>', BASE_URL.dev + Services.login);

        const requestBody = {
            "db": "generic_wms",
            "login": username,
            "password": password,
          }

        try {
            const response = await axios.post(BASE_URL.dev + Services.login, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    timeout: 30000,
                },
            });
            console.log('RESPONSE ==>', response.data);

            if(response.data.result?.key) {
                await AsyncStorage.setItem('sessionKey', response.data.result.key);
                console.log('Session key stored');
                return response.data.result;
            }else {
                throw new Error('Login failed: No session key received');
            }
        } catch (error) {
            console.error('Error:', error);
        }
};

export const checkExistingSession = async () => {
    try {
        const sessionkey = await AsyncStorage.getItem('sessionKey');
        return sessionkey ? { key: sessionkey } : null;
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

//logout
export const logout = async () => {
    try {
        await AsyncStorage.removeItem('sessionKey');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};
