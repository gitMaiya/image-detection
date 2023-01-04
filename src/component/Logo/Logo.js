import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
const Logo = () => {
    return (
        <div className='ma4 mt0'>
        <Tilt>
        <div className='center Tilt shadow-2' options={{max : 55}} style={{ height: '150px', width : '150px'}}>
            <h1>👀</h1>
        </div>
        </Tilt>

        </div>

    );
}

export default Logo;