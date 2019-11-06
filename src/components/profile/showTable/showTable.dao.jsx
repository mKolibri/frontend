import { address } from '../../configs/config';

const showTableFetch = async function(path) {
    try {
        const result = await fetch(address + path, {
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

export { showTableFetch };