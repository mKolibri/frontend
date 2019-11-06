import { address } from './configs/config';

const logOut = async function() {
    try {
        const result = await fetch(address + 'logout', {
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

export { logOut };