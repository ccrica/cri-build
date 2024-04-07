window.onload = function() {
            showTimes();
            fetchDbCri();
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

