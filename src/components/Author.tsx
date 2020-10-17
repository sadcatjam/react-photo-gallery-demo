import React, { DOMAttributes, FunctionComponent } from 'react'
import missingPhoto from '../assets/missing-photo.svg'
import './Author.css'

type Props = {
  name: string
  photoUrl: string
  portfolioUrl: string
  username: string
}

const Author: FunctionComponent<Props> = ({ name, photoUrl, portfolioUrl, username }) => {
  const onClick: DOMAttributes<HTMLDivElement>['onClick'] = (e) => {
    e.preventDefault()
    if (portfolioUrl)
      window.open(portfolioUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='author' onClick={onClick}>
      <img className='author-photo' srcSet={`${photoUrl},${missingPhoto}`} />
      <div className='author-name-container'>
        <p className='author-name'>{name}</p>
        <p className='author-username'>{'@' + username}</p>
      </div>
    </div>
  )
}

export default Author
