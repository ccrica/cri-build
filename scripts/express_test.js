const express = require('express');
const app = express();
const PORT = 3717;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});