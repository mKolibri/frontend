import { address } from './config';

// login, registration, addTable
const post = async(body, path) => {
    try {
        let result;
        if (path === 'login' || path === 'registration') {
            result = await fetch(address + path, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        } else {
            result = await fetch(address + path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
        }

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

// logout, getUser, tables
const get = async(path) => {
    try {
        const result = await fetch(address + path, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

export { post, get };