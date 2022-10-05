import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Home () {
    const navigate = useNavigate();
    
    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column', height:'100vh'}}>
            <div style={{color: '#FFA500',fontSize:'100px',padding:'30px 0px'}}>
                <p>Welcome</p>
            </div>
            {/* <div>
                <button onClick={() => { navigate('/mentorLogin') }} style={{backgroundColor:'purple',padding:'15px 32px',fontSize:'20px', margin:'10px 30px',color:'white',borderRadius:'15px'}}>Mentor</button>
                <button onClick={() => { navigate('/studentLogin') }} style={{backgroundColor:'yellow',padding:'15px 32px',fontSize:'20px', margin:'10px 30px',borderRadius:'15px'}}>Student</button>
            </div> */}
        </div>
    )
}