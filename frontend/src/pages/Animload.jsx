import React from 'react';
import { Player } from "@lottiefiles/react-lottie-player"; 
import animationData from "../../assets/animatedloader/mainscene.json";
import './Animload.css';

const Animload = () => {
  return (
    <div className='parent_animload_'>
      <Player
        autoplay
        loop
        src={animationData}
        className="animload-player"
      />
    </div>
  );
};

export default Animload;
