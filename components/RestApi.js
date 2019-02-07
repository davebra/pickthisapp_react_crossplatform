import { AsyncStorage } from 'react-native';
import { RESTAPI_URL } from 'react-native-dotenv';

export async function getThings(latitude, longitude, radius) {
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/things?lat=${latitude}&lng=${longitude}&radius=${radius}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function loginUser(provider, providerid) {
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                provider,
                providerid,
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function signupUser(provider, providerid, nickname) {
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                provider,
                providerid,
                nickname
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function getUserThings(userid) {
    const token = await AsyncStorage.getItem('userToken');
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/user/${userid}/things/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            }
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function changeThingStatus(thingid, status) {
    const token = await AsyncStorage.getItem('userToken');
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/things/${thingid}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                status
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function changeThingAvailability(thingid, availability) {
    const token = await AsyncStorage.getItem('userToken');
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/things/${thingid}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                availability
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function uploadImage(image) {
    const token = await AsyncStorage.getItem('userToken');
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                image: image
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function addThings(type, lat, lng, tags, images) {
    const token = await AsyncStorage.getItem('userToken');
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/things`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                type,
                lat,
                lng,
                tags,
                images
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function getTags(text) {
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/tags?s=${text}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}

export async function addNewTag(tag) {
    const token = await AsyncStorage.getItem('userToken');
    return new Promise((resolve, reject) => {
        fetch(`${RESTAPI_URL}/tags`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tag
            }),
        })
        .then((resp) => {
            return resp.json();
        })
        .then((resp) => {
            resolve(resp);
        });
    });
}