import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, List, Layout, Table, Space } from 'antd';
import { DeleteOutlined,EditOutlined } from '@ant-design/icons';
import MenuBar from '../Components/navBar';
import HttpRequest from '../utils/Http'
import User from '../utils/User';


export default function Home () {
    const { Content} = Layout;
    const { Meta } = Card;
    const navigate = useNavigate();
    const {get,deletes} = HttpRequest()
    const {getUser} = User();
    const [recipesList,saveRecipesList] = useState();
    const [curUserId,setCurUserId] = useState();
    
    
    console.log(curUserId)
    function getAllList () {
        get('/recipes',{"limit":10})
        .then((res)=> {
            console.log("recipes list",res)
            saveRecipesList(res)
            // setCourseList(res.courselist)
            // setcourseId(res.courselist[0].courseId)
        })
    }

    useEffect(() => {
        getAllList();
        setCurUserId(getUser);
        
        // get('/recipes',{"limit":10})
        // .then((res)=> {
        //     console.log("recipes list",res)
        //     saveRecipesList(res)
        //     // setCourseList(res.courselist)
        //     // setcourseId(res.courselist[0].courseId)
        // })
        // get('/teacher/queryWillMeetingList')
        // .then((res)=> {
        //     console.log('upcoming is ', res)
        //     setUpcomingList(res.meetingList.slice(0,3))
        // })
    }, [])
    function editRecipe (id) {
        console.log(id)
        alert("edit")
        // deletes(`/recipe/${id}`)
        // .then((res)=>{
        //     console.log(res)
        //     if(res.message === 'success'){
        //         recipesList.map(item => {
        //             if(item.recipe_id === id){
        //                 // recipesList.splice(recipesList.indexOf(item),1)
        //                 getAllList();
        //             }
                    
        //         })
        //         // saveRecipesList(recipesList)
        //     }
        // })
        // navigate(`/mentorCourseDetails?courseID=${id}`)

    }
    
    function deleteRecipe (id) {
        console.log(id)
        deletes(`/recipe/${id}`)
        .then((res)=>{
            console.log(res)
            if(res.message === 'success'){
                recipesList.map(item => {
                    if(item.recipe_id === id){
                        // recipesList.splice(recipesList.indexOf(item),1)
                        getAllList();
                    }
                    
                })
                // saveRecipesList(recipesList)
            }
        })
        // navigate(`/mentorCourseDetails?courseID=${id}`)

    }
    
    return (
        <Layout className='layout'>
            <MenuBar />
            <Content style={{display:'flex',flexDirection:'column'}}>
                
                <div style={{display:'flex',flexDirection:'column' }}>
                <p>All the Receipes</p>
                    <div style={{  margin:'10px 20px'}}>
                        {<List
                        grid={{ gutter: 8, column: 4 }}
                        dataSource={recipesList}
                        renderItem={item => (
                            <List.Item>
                            <Card
                                hoverable
                                style={{ width: '70%' }}
                                cover={
                                <img onClick={()=>{ navigate(`/recipeDetails?recipeId=${item.recipe_id}`)}}
                                    src={ item.recipe_img }
                                />
                                }
                                
                                actions={ item.user_id === curUserId ? [
                                    <DeleteOutlined key="open" onClick={ () => { deleteRecipe(item.recipe_id) }}/>,
                                    <EditOutlined key="open" onClick={ () => { editRecipe(item.recipe_id) }}/>,
                                    ] : []}
                                
                                
                            >
                                <Meta
                                title={ <p style={{width:'100%'}} onClick={()=>{ navigate(`/recipeDetails?recipeId=${item.recipe_id}`)}}>{item.recipe_name}</p> }
                                // description={item.courseDesc}
                                />
                            </Card>
                            </List.Item>
                        )}
                        />}
                    </div>
                </div>
            </Content>
        </Layout>
    )
}