fetch('/env')
    .then(response => response.json())
    .then(data => {
        const { LS_API_USER, LS_API_PWD } = data;
        // Call the lsapi function with the environment variables
        return lsapi(LS_API_USER, LS_API_PWD);
    })
    .then(sessionKey => {
        // Handle the response from the lsapi function
        console.log('Session key:', sessionKey);
        return recupResult(sessionKey);
    })
    .catch(error => {
        console.error('Problem with request:', error.message);
    });

function lsapi(LS_API_USER, LS_API_PWD) {
    const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': '88'
        },
        body: JSON.stringify({method: 'get_session_key', params: [LS_API_USER, LS_API_PWD], id: 1})
    };

    return fetch(url, options)
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            console.log('Response from ls.dumspiro.ch:', data);
            return data.result; // Return the session key
        })
        .catch(error => {
            console.error('Problem with request:', error.message);
            throw error;
        });
}

function recupResult(sessionKey) {
    const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': '88'
        },
        body: JSON.stringify({method: 'export_responses_by_token',
                             params: [sessionKey,
                                "983971","json","5t33ZmJPP7Gm9QB","fr","all","code","long"], id: 1})
    };

    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log('Response from second request:', data);
            if (data.result) {
                // Decode the Base64-encoded CSV data
                const csvData = atob(data.result);
                console.log('Decoded CSV data:', csvData);
                return csvData;
            } else {
                throw new Error('No result in response');
            }
        })
        .catch(error => {
            console.error('Problem with second request:', error.message);
            throw error;
        });
}