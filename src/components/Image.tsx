import React, { FunctionComponent } from 'react'
import './Image.css'

type Props = {
  description: string
  url: string
}

const Image: FunctionComponent<Props> = ({ description, url }) => {
  return <img className='image' src={url} title={description} />
}

export default Image
