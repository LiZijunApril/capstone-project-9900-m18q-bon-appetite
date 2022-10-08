import { useState } from 'react';

export default function User () {
    const [user, setUser] = useState(null);

    function saveUser (user) {
        sessionStorage.setItem('user',JSON.stringify(user));
        setUser(user);
    }

    function getUser () {
        const usr = sessionStorage.getItem('user');
        if (usr) {
            setUser(JSON.parse(usr));
            return JSON.parse(usr);
        }
        
    }

    function saveCourseList (courseList) {
        sessionStorage.setItem('courseList',JSON.stringify(courseList));
    }

    function getCourseList () {
        const courseList = JSON.parse(sessionStorage.getItem('courseList'));
        return courseList;
    }

    return {
    user,
    saveUser,
    getUser,
    saveCourseList,
    getCourseList
    }
}
