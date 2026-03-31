import React from 'react';

const Video = () => {
  return (
    <section className="w-full bg-white flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-7xl aspect-video rounded-lg overflow-hidden shadow-lg">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"         
        >
          <source src="organic tattva video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default Video;