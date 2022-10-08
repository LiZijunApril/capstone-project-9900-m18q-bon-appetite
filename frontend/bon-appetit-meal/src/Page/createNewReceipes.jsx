import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, List, Layout, Table, Space,Form, Input, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import MenuBar from '../Components/navBar';
import HttpRequest from '../utils/Http'


export default function CreateNewRecipes () {

    const navigate = useNavigate();
    const {post} = HttpRequest()
    const onFinish = (values) => {
        console.log(values.ingredients.split(" "))
        values.food_type_id = parseInt(values.food_type_id)
        values.ingredients = `${values.ingredients.split(" ")}`
        values.nutrition = `${values.nutrition.split(" ").map(Number)}`
        console.log(values)
        
        post('/addrecipe',values)
        .then((res) => {
            // console.log(res.msg)
            if (res.message === 'success') {
                message.success("Create new recipe successful")
                navigate('/')
            }
        })
    };
    // useEffect(() => {
    //     post('/recipes',{"limit":10})
    //     .then((res)=> {
    //         console.log("recipes list",res)

            // setCourseList(res.courselist)
            // setcourseId(res.courselist[0].courseId)
        // })
        // get('/teacher/queryWillMeetingList')
        // .then((res)=> {
        //     console.log('upcoming is ', res)
        //     setUpcomingList(res.meetingList.slice(0,3))
        // })
    // }, [])
    function startGame (id) {
        console.log(id)
        // navigate(`/mentorCourseDetails?courseID=${id}`)

    }
    
    return (
        <Layout className='layout'>
            <MenuBar />
            <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',height:'60vh'}}>
            <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>Create new receipes</p>
                <Form
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 40,
                    }}
                    layout="horizontal"
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="recipe_name"
                        label="recipe name"
                        rules={[{ required: true, message: 'Please input your recipe name!' }]}
                    >
                        <Input placeholder="recipe name"/>
                    </Form.Item>
                    <Form.Item
                        name="food_type_id"
                        label="food type id"
                        rules={[{ required: true, message: 'Please input your food type id!' }]}
                    >
                        <Input
                        placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="ingredients"
                        label="ingredients"
                        rules={[{ required: true, message: 'Please input your ingredients!' }]}
                    >
                        <Input placeholder="recipe name"/>
                    </Form.Item>
                    <Form.Item
                        name="nutrition"
                        label="nutrition"
                        rules={[{ required: true, message: 'Please input your food type id!' }]}
                    >
                        <Input
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{color:'white',backgroundColor:'#2EB394',marginTop:'20px',borderRadius:'10px'}}>
                            Create
                        </Button>
                        <a onClick={()=>{navigate('/')}} style={{textDecoration:'underline',color:'green',fontSize:'20px',marginLeft:'20px',marginTop:'20px'}}>
                            Cancel
                        </a>
                    </Form.Item>
                </Form>
                
            </div>
        </Layout>
    )
}