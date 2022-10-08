import {  message } from 'antd';
import { getToken } from './TokenUtils';

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
                    if (res.hasOwnProperty("status")) {
                        console.log(res)
                        message.error(res.status);
                        rejected({ msg: res.status });
                    } else {
                        resolved(res);
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
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
        });
    };
    /**
     * @description:  get
     * @param {string} url
     * @param {object} params
     * @return {Promise}
     */
     const get = (url, params) => {
        if (params) {
            const paramsArray = [];
            Object.keys(params).forEach((key) =>
                paramsArray.push(`${key}=${params[key]}`)
            );
            url += "?" + paramsArray.join("&");
        }

        return request(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
        },
        });
    };
    const deletes = (url) => {

        return request(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
        },
        });
    };

    return {
        post,
        deletes,
        get
    };
}
