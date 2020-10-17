import React, { FunctionComponent } from 'react'
import eyeImage from '../assets/eye.svg'
import './ViewCount.css'

type Props = {
  count: number
}

const ViewCount: FunctionComponent<Props> = ({ count }) => {
  return (
    <div className='view-count'>
      <p className='view-count-text'>{count}</p>
      <img className='eye-symbol' src={eyeImage} />
    </div>)
}

export default ViewCount
