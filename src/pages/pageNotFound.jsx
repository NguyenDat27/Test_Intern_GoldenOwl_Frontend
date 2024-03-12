import React from 'react';
import svg from '../assets/404.svg'
import './pageNotFound.css'

const PageNotFound = () => {
  return (
    <div className='pagenotfound'>
      <div className="cont-404">
          <img src={svg} alt="svg" />
          <button onClick={() => window.location.href = '/login'}>Quay lại trang chủ</button>
      </div>
    </div>
  )
}

export default PageNotFound