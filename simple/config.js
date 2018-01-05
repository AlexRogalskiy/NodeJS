/**
 * Configuration properties
 */
module.exports.resizeVersion =
{
    base:
    {
        thumbnail:
        {
            width: 100,
            height: "100!"
        },
        small:
        {
            width:200,
            height:"150!"
        },
        medium:
        {
            width:400,
            height:300
        },
        large:
        {
            width: 800,
            height: 600
        }
    },
    default:
    {
        thumbnail:
        {
            width:80,
            height:"80!"
        },
        small:
        {
            width:200,
            height:"150!"
        },
        medium:
        {
            width:400,
            height:300
        },
        large:
        {
            width: 800,
            height: 600
        }
    },
    location :
    {
        thumbnail:
        {
            width:80,
            height:"80^",
            imageArgs:
            [
                "-gravity", "center",
                "-extent", "80x80"
            ]
        },
        small:
        {
            width:"200",
            height:"150^",
            imageArgs:
            [
                "-gravity", "center",
                "-extent", "200x150"
            ]
        },
        medium:
        {
            width:400,
            height:300
        },
        large:
        {
            width: 800,
            height: 600
        }
    }
};

module.exports.dirs =
{
    temp: './temp',

    base: '/public/uploads/',
    baseUrl: '/uploads',

    default: '/public/uploads/default/',
    defaultUrl: '/uploads/default',

    location: '/public/uploads/location/',
    locationUrl: '/uploads/location'
};