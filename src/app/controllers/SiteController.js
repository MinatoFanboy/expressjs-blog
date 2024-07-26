const request = require('request');
const crypto = require('crypto');

const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    // [GET], /
    index(req, res, next) {
        Course.find({})
            .then((courses) => {
                res.render('home', {
                    courses: multipleMongooseToObject(courses),
                });
            })
            .catch(next);
    }

    // [GET], /search
    search(req, res) {
        res.render('search');
    }

    // [GET], /test
    test(req, res) {
        const secretKey = '';
        const accessToken = '';

        /** calculateHMacSHA256 */
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(accessToken);

        const options = {
            url: 'https://graph.zalo.me/v2.0/me',
            method: "GET",
            headers: {
                access_token: accessToken,
                appsecret_proof: hmac.digest('hex'),
            },
            qs: {
                fields: 'id,name,birthday,picture,phone'
            },
            json: true,
        };

        request(options, (error, response, body) => {
            if (error) {
                res.json(error);
                console.error("Error:", error);
            } else {
                console.log("Response Code:", response.statusCode);
                res.json(body);
            }
        });
    }
}

module.exports = new SiteController();
