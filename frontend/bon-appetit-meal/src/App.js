import './App.css';
import 'antd/dist/antd.css';
import React, { useState } from 'react';
import { Routes, Route, useNavigate} from 'react-router-dom';
import { Table, Modal, Space, Layout, Button, Form, Input, message } from 'antd';

import Home from './Page/home.jsx';
import Login from './Page/Login.jsx';
import Register from './Page/register.jsx'

const { Content } = Layout;

function App() {
  return (
    <Layout className="layout" style={{display:'flex',width:'100%',height:'100%'}}>
        {/* <div style={{display:'flex',backgroundColor:'gray',height:'5%'}} id="homeNavigate">
          <div className="logo" />
          <Button onClick={()=>{noteManagement()}} shape='round' style={{margin:'8px 5px', backgroundColor:'pink', margin:'auto 20px'}} >Take Notes</Button>
          <div style={{width:'85%'}}></div>
          <div style={{margin:'auto 30px'}}><MenuBar style={{}}/></div>
          
        </div> */}
        <Content style={{ padding: '0px 0px'}}>
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='login' element={<Login />}/>
              <Route path='register' element={<Register />}/>
              {/* <Route path='mentorLogin' element={<MentorLogin />}/>
              <Route path='mentorCoursePages' element={<MentorCourasPages />}/>
              <Route path='mentorCourseDetails' element={<MentorCourasDetails />}/>
              <Route path='mentorRegularMeeting' element={<MentorRegularMeeting />}/>
              <Route path='mentorOneOffMeeting' element={<MentorOneOffMeeting />}/>
              <Route path='mentorGroupManagement' element={<MentorGroupManagement />}/>
              <Route path='mentorMeeting' element={<MentorMeeting />}/>
              <Route path='mentorMeeting' element={<MentorMeeting />}/>

              <Route path='studentCoursePages' element={<StudentCourasPages />}/>
              <Route path='studentCourseDetails' element={<StudentCourasDetails />}/>
              <Route path='studentRegularMeeting' element={<StudentRegularMeeting />}/>
              <Route path='studentOneOffMeeting' element={<StudentOneOffMeeting />}/>
              <Route path='studentBookMeeting' element={<StudentBookMeeting />}/>
              <Route path='studentMeeting' element={<StudentMeeting />}/>
              <Route path='releaseSchedules' element={<ReleaseSchedules />} /> */}
            </Routes>
        </Content>
    </Layout>
  );
}

export default App;
