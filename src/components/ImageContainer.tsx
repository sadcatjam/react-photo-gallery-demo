import React, { FunctionComponent } from 'react'
import Author from './Author'
import Image from './Image'
import './ImageContainer.css'
import { UnsplashPhoto } from '../api/Unsplash'
import ViewCount from './ViewCount'

type Props = {
  photo: UnsplashPhoto
}

const ImageContainer: FunctionComponent<Props> = ({ photo = {} as UnsplashPhoto }) => {
  return (
    <div className='image-container'>
      {<Author
        portfolioUrl={photo?.user?.links?.html || ''}
        name={photo?.user?.name || ''}
        photoUrl={photo?.user?.profile_image?.large || ''}
        username={photo?.user?.username || ''}
      />}
      {<Image url={photo?.urls?.regular || ''} description={photo.description || ''} />}
      {<ViewCount count={photo.views || 0} />}
    </div>
  )
}

export default ImageContainer
