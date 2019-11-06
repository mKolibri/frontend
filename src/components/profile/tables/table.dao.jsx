import { address } from '../../configs/config';

const tables = async function() {
    try {
        const result = await fetch(address + 'tables', {
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

export { tables };