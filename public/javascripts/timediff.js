window.onload = function() {
            showTimes();
            fetchDbCri();
            fetchSessionKeyDetails();
        }

        function showTimes() {
            const userTime = new Date();
            document.getElementById('userTime').textContent = userTime.toISOString();
            fetch('/time')
                .then(response => response.text())
                .then(serverTime => {
                    document.getElementById('serverTime').textContent = serverTime;
                    const diff = new Date(serverTime).getTime() - userTime.getTime();
                    document.getElementById('diff').textContent = diff + ' milliseconds';
                    console.log("fait!");
                });
        }

        function fetchDbCri() {
            fetch('/db_cri')
                .then(response => response.text())
                .then(db_cri => {
                    document.getElementById('db_cri').textContent = db_cri;
                });
        }

        function fetchSessionKeyDetails() {
            fetch('/sessionKeyDetails')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`ça fonctionne pas : ${response.status}`);
                    }
                    return response.json();
                })
                .then(sessionKeyDetails => {
                    document.getElementById('sessionKeyDetails').textContent = sessionKeyDetails.result;
                })
                .catch(error => {
                    console.log('Fetch error: ', error);
                });
        }
