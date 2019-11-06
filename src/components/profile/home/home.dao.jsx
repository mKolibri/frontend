import { address } from '../../configs/config';

const getUserInfo = async function() {
    try {
        const result = await fetch(address + 'user', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return result;
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

export { getUserInfo };