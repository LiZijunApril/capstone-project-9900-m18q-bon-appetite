import {  message } from 'antd';
import { getToken } from './TokenUtils';
import { useNavigate } from 'react-router-dom';
const BASE_URL = "http://localhost:8000/api";

export default function HttpRequest () {
    var a = 0;
    const navigate = useNavigate();
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
                        if(res.status === "Unauthorized"){
                            message.error("username or password is Wrong!"+(a+1));
                            a = a+1;
                            if(a===5){
                                message.error("You have reached the maximum number of attempts and are about to return to the home page!")
                                function backH(){ 
                                    navigate('/'); 
                                } 
                                setTimeout(backH,1000);
                            }
                        } else {
                            message.error(res.status);
                        }
                        rejected({ msg: res.status });
                    } else {
                        a = 0;
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
