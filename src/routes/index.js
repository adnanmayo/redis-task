const express = require('express');
const targetRoute = require('./target.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/targets',
        route: targetRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
