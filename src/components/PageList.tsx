import React, {
  cloneElement,
  FunctionComponent,
  useEffect,
  useMemo,
  useRef
} from 'react'
import './PageList.css'

const ITEM_WIDTH = document.documentElement.clientWidth > 540
  ? 60
  : 45

type Props = {
  currentPage: number
  onPageClick: (newPage: number) => void
  pageCount: number
}

// To support page change animations page list always has fixed size of 7
// elements even if they are empty. Each of these 7 elements is a container for
// 3 elements: [previous, current, next].
const PageList: FunctionComponent<Props> = ({
  currentPage, onPageClick, pageCount
}) => {
  const pageList: string[] = useMemo(() => {
    return new Array(pageCount)
      .fill(undefined)
      .map((e, i) => (i + 1).toString())
  }, [pageCount])
  const currentPageIndex = pageList.indexOf(currentPage.toString())
  const displayList: JSX.Element[][] = useMemo(() => {
    return buildDisplayList(pageList, currentPageIndex)
  }, [pageList, currentPageIndex])
  const previousDisplayList = usePrevious(displayList) || []

  useEffect(() => {
    for (const index of displayList.keys()) {
      document.getElementById(`page-item-${index}`)!.scrollLeft = ITEM_WIDTH
    }
  })

  useEffect(() => {
    return animate(displayList, previousDisplayList)
  }, [displayList, previousDisplayList])

  const handlePageClick = (element: string, index: number) => {
    if (!element) { // element can be an empty string
      return undefined
    }

    if (element === currentPage.toString()) {
      return undefined
    }

    if (element === '...' && index === 1) {
      return onPageClick(Number.parseInt(displayList[2][1].props.children))
    }

    if (element === '...' && index === 5) {
      return onPageClick(Number.parseInt(displayList[4][1].props.children))
    }

    return onPageClick(Number.parseInt(element, 10))
  }

  return (
    <div className='page-list-container'>
      <div className='page-list'>
        {
          displayList.map((displayItem, index) =>
            <div
              id={`page-item-${index}`}
              key={index}
              className='page-item-container'
              onClick={() => handlePageClick(displayItem[1].props.children, index)}
            >
              {displayItem.map((item) => item)}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default PageList

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function buildDisplayList(pageList: string[], currentPageIndex: number): JSX.Element[][] {
  const displayList: JSX.Element[][] = new Array(7)

  // Reference:
  // ['',  '', '',  1,  2, ...,  7] pageIndex === 0
  // ['',  '',  1,  2,  3, ...,  7] pageIndex === 1
  // ['',   1,  2,  3,  4, ...,  7] pageIndex === 2
  // [ 1,   2,  3,  4,  5,   6,  7] pageIndex === 3
  // [ 1, ...,  4,  5,  6,   7, ''] pageIndex === 4
  // [ 1, ...,  5,  6,  7,  '', ''] pageIndex === 5
  // [ 1, ...,  6,  7, '',  '', ''] pageIndex === 6
  displayList[0] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = <div className='page-item'></div>
    items[1] = <div className='page-item'>{currentPageIndex >= 3 ? pageList[0] : ''}</div>
    items[2] = (() => {
      if (currentPageIndex < 2)
        return <div className='page-item'></div>
      if (currentPageIndex < 4)
        return <div className='page-item'>{pageList[currentPageIndex - 2]}</div>
      return <div className='page-item'>...</div>
    })()

    return items
  })()
  displayList[1] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = cloneElement(displayList[0][1])
    items[1] = cloneElement(displayList[0][2])
    items[2] = <div className='page-item'>{
      currentPageIndex === 0 ? '' : pageList[currentPageIndex - 1]
    }</div>

    return items
  })()
  displayList[2] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = cloneElement(displayList[1][1])
    items[1] = cloneElement(displayList[1][2])
    items[2] = <div className='page-item'>{pageList[currentPageIndex]}</div>

    return items
  })()
  displayList[3] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = cloneElement(displayList[2][1])
    items[1] = cloneElement(displayList[2][2])
    items[2] = <div className='page-item'>{
      currentPageIndex === pageList.length - 1
        ? ''
        : pageList[currentPageIndex + 1]
    }</div>

    return items
  })()
  displayList[4] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = cloneElement(displayList[3][1])
    items[1] = cloneElement(displayList[3][2])
    items[2] = (() => {
      if ((pageList.length - 1 - currentPageIndex) < 2)
        return <div className='page-item'></div>
      if ((pageList.length - 1 - currentPageIndex) < 4)
        return <div className='page-item'>{pageList[currentPageIndex + 2]}</div>
      return <div className='page-item'>...</div>
    })()

    return items
  })()
  displayList[5] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = cloneElement(displayList[4][1])
    items[1] = cloneElement(displayList[4][2])
    items[2] = <div className='page-item'>{
      (pageList.length - 1 - currentPageIndex) > 2
        ? pageList[pageList.length - 1]
        : ''
    }</div>

    return items
  })()
  displayList[6] = (() => {
    const items: JSX.Element[] = new Array(3)
    items[0] = cloneElement(displayList[5][1])
    items[1] = cloneElement(displayList[5][2])
    items[2] = <div className='page-item'></div>

    return items
  })()

  return displayList
}

function animate(
  displayList: JSX.Element[][],
  prevDisplayList: JSX.Element[][]
): void | (() => void) {
  if (!prevDisplayList.length) {
    return undefined
  }

  const curPage = Number.parseInt(displayList[3][1].props.children)
  const prevPage = Number.parseInt(prevDisplayList[3][1].props.children)

  if (curPage === prevPage) {
    return undefined
  }

  const moveLeft = curPage > prevPage
  const elementsToAnimate: HTMLElement[] = []

  for (const [index, item] of displayList.entries()) {
    if (item[1].props.children !== prevDisplayList[index][1].props.children) {
      const el = document.getElementById(`page-item-${index}`)!
      elementsToAnimate.push(el)
      el.scrollLeft = moveLeft ? 0 : ITEM_WIDTH * 2
    }
  }

  const interval = setInterval(() => {
    for (const element of elementsToAnimate) {
      if (element.scrollLeft !== ITEM_WIDTH) {
        element.scrollLeft += moveLeft ? 1 : -1
      } else {
        clearInterval(interval)
      }
    }
  }, 2)

  return function cleanup() {
    clearInterval(interval)
  }
}
