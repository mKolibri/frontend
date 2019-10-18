const address = 'http://localhost:10000/';

const login = async(user) => {
    try {
        const result = await fetch(address + 'login', {
            method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
        });

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

const registry = async(curentUser) => {
    try {
        const result = await fetch(address + 'registration', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(curentUser)
        });

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

const userLogout = async() => {
    try {
        const result = await fetch(address + 'logout', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

const newTable = async(table) => {
    try {
        const result = await fetch(address + 'addTable', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(table)
        });        

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

const getUser = async() => {
    try {
        const result = await fetch(address + `user`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });    

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

const getTable = async(tableName) => {
    try {
        const result = await fetch(`${address}showTable?table=${tableName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }); 

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

const getTables = async() => {
    try {
        const result = await fetch(address + "tables", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }); 

        return (await result.json());
    } catch(error) {
        return ({
            message: error.message
        });
    }
}

export { login, registry, userLogout, newTable, getUser, getTable, getTables };