/**
 * App configuration properties
 */
module.exports =
{
    default:
    {
        location: '/public',
    },
    layout:
    {
        defaultLayout: 'main',
        layoutsDir:'public/views/layouts',
        partialsDir:'public/views/partials',
    },
    log:
    {
        fileName: 'access.log',
        location: '/logs',
        rotation: '1d',
    },
    js:
    {
        url: '/js',
        location: '/public/js',
        maxAge: 10000000000000,
    },
    css:
    {
        url: '/css',
        location: '/public/css',
        maxAge: 10000000000000,
    },
    vendor:
    {
        url: '/vendor',
        location: '/public/vendor',
    },
    images:
    {
        url: '/images',
        location: '/public/images',
    },
    views:
    {
        url: '/views',
        location: '/public/views',
    },
    resources:
    {
        url: '/resources',
        location: '/public/resources',
    },
    icons:
    {
        url: '/favicon_24x24.ico',
        location: '/public/images/icons',
    },
};
