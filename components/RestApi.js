import { AsyncStorage } from 'react-native';
import { RESTAPI_URL, S3_BUCKET_URL } from 'react-native-dotenv';

async function getThings(latitude, longitude, radius) {
    try {
        let response = await fetch(`${RESTAPI_URL}/things?lat=${latitude}&lng=${longitude}&radius=${radius}`);
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function loginUser(provider, providerid) {
    try {
        let response = await fetch(`${RESTAPI_URL}/login`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider,
                providerid,
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function signupUser(provider, providerid, nickname) {
    try {
        let response = await fetch(`${RESTAPI_URL}/signup`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider,
                providerid,
                nickname
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function getUserThings(userid) {
    const token = await AsyncStorage.getItem('userToken');
    try {
        let response = await fetch(`${RESTAPI_URL}/user/${userid}/things/`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function changeThingStatus(thingid, status) {
    const token = await AsyncStorage.getItem('userToken');
    try {
        let response = await fetch(`${RESTAPI_URL}/things/${thingid}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function changeThingAvailability(thingid, availability) {
    const token = await AsyncStorage.getItem('userToken');
    try {
        let response = await fetch(`${RESTAPI_URL}/things/${thingid}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                availability
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function uploadImage(image) {
    const token = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('file', image);
    try {
        let response = await fetch(`${RESTAPI_URL}/upload`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

async function addThings(type, lat, lng, tags, images) {
    const token = await AsyncStorage.getItem('userToken');
    try {
        let response = await fetch(`${RESTAPI_URL}/things`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type,
                lat,
                lng,
                tags,
                images
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(error);
    }
}

export default {
    getThings,
    loginUser,
    signupUser,
    getUserThings,
    changeThingStatus,
    changeThingAvailability,
    uploadImage,
    addThings
};
