import React from 'react';
import Style from './index.less';

const colors = ['#fff', '#ff0', '#f00', '#f0f', '#0ff', '#00f', '#0f0'];

const Loading = ({ text = 'loading' }) => {
  const changeColor = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors[Math.floor(Math.random() * colors.length)]);
  };

  return (
    <div className={Style.loading} onClick={changeColor}>
      {text}
    </div>
  );
};

export default Loading;
