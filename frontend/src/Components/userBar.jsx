import React from 'react';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Button, Menu, message } from 'antd';
import { useNavigate } from 'react-router-dom';



export default function UserBar () {
    const navigate = useNavigate();
    let menu = <Menu></Menu>;
    // if (sessionStorage.getItem('user')) {
        if (sessionStorage.getItem('userToken')) {
    // const usr = JSON.parse(sessionStorage.getItem('user'))
    menu = (
            <Menu>
                {/* <Menu.Item>
                <div>{usr.zId}</div>
                </Menu.Item> */}
                <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" onClick={ () => {
                    // sessionStorage.removeItem('user')
                    sessionStorage.removeItem('userToken')
                    // sessionStorage.removeItem('courseList')
                    navigate('/')
                    window.location.reload()
                } }>
                    Logout
                </a>
                </Menu.Item>
            </Menu>
    );
} else {
    menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={ () => { navigate('/login') } }>
                        Sign In
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={ () => { navigate('/register') } }>
                        Register
                    </a>
                </Menu.Item>
            </Menu>
    );
}
    return (
    <div style={ { display: 'flex', alignItems: 'center', margin:'5px' } }>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <span>
            <Dropdown overlay={ menu } placement="bottomRight">
            <Avatar size='large' icon={<UserOutlined />} />
            </Dropdown>
        </span>
    </div>
    );
}