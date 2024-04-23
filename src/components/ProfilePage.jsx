import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"

function ProfilePage() {
  const navigate = useNavigate()
  const handleMainPage = async (event) => {
    event.preventDefault();
    navigate("/main");
  }

  return(
      <div className='main-page-container'>
        <div className='top-right-buttons'>
            <button style={{marginLeft: '10px', marginTop: '10px', backgroundColor: 'rgb(178, 114, 238)', color: 'black', fontWeight: 'bold'}} className="btn waves-effect waves-light" type="button" id="mainPageButton" onClick={handleMainPage}>Main Page</button>
          </div>
        <div className='center-page-container'>
          <h1>Profile</h1>
          <text>Username: </text>
          <text>First Name: </text>
          <text>Last Name: </text>
          <text>Account Type: </text>
        </div>
      </div>
      
  );
}

export default ProfilePage;
