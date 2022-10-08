import React from 'react';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Button, Menu, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BellOutlined } from '@ant-design/icons';
import UserBar from './userBar';


export default function MenuBar () {
    const navigate = useNavigate();
    function createNewRecipe () {
        navigate("/createNewRecipes")
    }
    function search () {
        navigate("/search")
    }

return (
    <div style={{display:'flex',backgroundColor:'gray',height:'5%'}}>
            {/* <embed src='./logo.svg'></embed> */}
        <Button onClick={()=>{navigate('/')}} shape='round' style={{margin:'8px 5px', backgroundColor:'white', margin:'auto 20px'}} >Home</Button>
        <Button onClick={()=>{createNewRecipe()}} shape='round' style={{margin:'8px 5px', backgroundColor:'white', margin:'auto 20px'}} >Create New Recipe</Button>
        <Button onClick={()=>{search()}} shape='round' style={{margin:'8px 5px', backgroundColor:'white', margin:'auto 20px'}} >Search</Button>
        <Button icon={<BellOutlined />} onClick={()=>{search()}} shape='round' style={{margin:'8px 5px', backgroundColor:'white', margin:'auto 20px'}} ></Button>
        <div style={{width:'70%'}}></div>
        <UserBar />
        {/* <div style={{width:'85%'}}></div> */}
        {/* <div style={{margin:'auto 30px'}}><MenuBar style={{}}/></div> */}
    </div>
);
}

