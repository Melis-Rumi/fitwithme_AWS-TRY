import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="content-wrapper">
        {/* Auth Buttons */}
        <div className="auth-buttons">
          <a href='/intro'>
            <button className="btn btn-signin">
              
                I'm interested!
              
            </button>
          </a>
          <a href='/login'>
            <button className="btn btn-login">
              
                Login
              
            </button>
          </a>
        </div>
        
        {/* Bio Section */}
        <div className="bio-section">
          <div className="bio-content">
            <h1>Melis Zhalalov</h1>
            <p>
            With a background in both natural bodybuilding and amateur boxing, 
            I know what it takes to push your limits and achieve your fitness goals. 
            Now, my passion is helping YOU become stronger, healthier, and happier—whether 
            that’s through lifting heavy metal or just feeling your best every day. 
            Whether you’re aiming to build muscle, lose weight, or improve your overall fitness, 
            I’ll be there every step of the way to guide you with expert knowledge, motivation, 
            and a focus on perfect form. If you’re ready to transform your body and mind, 
            let’s work together to lift you to new heights!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;