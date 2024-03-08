const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(logger);

app.use('/courses', courseRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
