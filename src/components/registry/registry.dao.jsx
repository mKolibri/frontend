import { address } from '../configs/config';

const registration = async function(body){
    try {
        const result = await fetch(address + 'registration', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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

export { registration };