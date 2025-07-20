const express = require('express');
const app = express();

const activeUsersRoute = require('./routes/activeUsers');
const statisticsRoute = require('./routes/statistics');

app.use('/api/active-users', activeUsersRoute);
app.use('/api/statistics', statisticsRoute);
