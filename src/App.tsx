import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { /* listPhotos, */ UnsplashPhoto } from './api/Unsplash'
import { listPhotos } from './api/UnsplashMock'
import Content from './components/Content'
import PageList from './components/PageList'
import SwipeHandler, { SwipeDirection } from './components/SwipeHandler'
import './App.css'

const PHOTOS_PER_PAGE = 10

const App: FunctionComponent = () => {
  const [imageList, setImageList] = useState([] as UnsplashPhoto[])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    console.log('listPhotos request')
    listPhotos(currentPage, PHOTOS_PER_PAGE)
      .then((response) => {
        setImageList(response.photos)
        setPageCount(response.pageCount)
        window.scroll({ behavior: 'smooth', left: 0, top: 0 })
      })
      .catch(console.error)
  }, [currentPage])

  const onSwipe = useCallback((direction: SwipeDirection) => {
    setCurrentPage((currentPage) => {
      return direction === SwipeDirection.LEFT
        ? Math.max(currentPage - 1, 1)
        : Math.min(currentPage + 1, pageCount)
    })
  }, [pageCount])

  return (
    <div className='app'>
      <SwipeHandler callback={onSwipe} />
      <Content photos={imageList} />
      <PageList
        currentPage={currentPage}
        onPageClick={(newPage) => setCurrentPage(newPage)}
        pageCount={pageCount}
      />
    </div>
  )
}

export default App
