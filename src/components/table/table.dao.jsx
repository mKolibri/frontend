import { address } from '../configs/config';

const sendRequest = async function(path, method, body) {
    let result;
    if (method === 'GET') {
        try {
            return await fetch(address + path, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        } catch(error) {
            return result;
        }
    } else {
        try {
            return await fetch(address + path, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });
        } catch(error) {
            return result;
        }
    }
};

export { sendRequest };