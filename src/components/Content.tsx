import React, { FunctionComponent } from 'react'
import './Content.css'
import ImageContainer from './ImageContainer'
import { UnsplashPhoto } from '../api/Unsplash'

type Props = {
  photos: UnsplashPhoto[]
}

const Content: FunctionComponent<Props> = ({ photos }) => {
  return (
    <div className='content'>
      {photos.map((photo) => <ImageContainer key={photo.id} photo={photo} />)}
    </div>
  )
}

export default Content
