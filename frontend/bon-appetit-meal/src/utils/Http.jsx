import {  message } from 'antd';

const BASE_URL = "http://localhost:8000/api";

export default function HttpRequest () {
    /**
     * @description: fetch Function
     * @param {string} url
     * @param {any} options
     * @return {Promise}
     */
    const request = (url, options) => {
        console.log('url is ',url)
        return new Promise((resolved, rejected) => {
            fetch(`${BASE_URL}${url}`, options)
                .then((res) => res.json())
                .then((res) => {
                    console.log(res)
                    if (res.code === 200) {
                        resolved(res.data);
                    } else {
                        
                        message.error(res.msg);
                        rejected({ msg: res.msg });
                    }
                }).catch((err) => {
                    message.error(err);
                    rejected(err);
                    });
        });
    };

    /**
     * @description: post
     * @param {string} url
     * @param {object} data
     * @return {Promise}
     */
    const post = (url, data) => {
        return request(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            // Authorization: getToken(),
        },
        body: JSON.stringify(data),
        });
    };

    return {
        post
    };
}
