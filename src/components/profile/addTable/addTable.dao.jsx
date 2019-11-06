import { address } from '../../configs/config';

const addTableFetch = async function(body) {
    try {
        const result = await fetch(address + 'addTable', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        return result;
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

export { addTableFetch };