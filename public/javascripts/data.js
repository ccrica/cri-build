window.onload = function() {
            handleFormSubmit();
        }

        function handleFormSubmit() {
            document.getElementById('submitForm').addEventListener('submit', function(event) {
                event.preventDefault();

                const name = document.getElementById('name').value;

                fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `name=${encodeURIComponent(name)}`,
                })
                .then(() => fetch(`/response_data?name=${encodeURIComponent(name)}`))
                .then(response => response.json())
                .then(data => {
                    // Access the first element of the array
                    const firstElement = data[0];

                    // Create a structured view of the data
                    const dataContainer = document.getElementById('dbData');
                    dataContainer.innerHTML = `
                        <p>Submit Date: ${firstElement.submitdate}</p>
                        <p>Email: ${firstElement.email}</p>
                        <p>Langue: ${firstElement.startlanguage}</p>
                    `;
                    document.getElementById('responseReceived').textContent = "Response";
                    document.documentElement.lang = firstElement.startlanguage;
                });
            });
        }