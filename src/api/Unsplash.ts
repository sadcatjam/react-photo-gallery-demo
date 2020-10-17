import Unsplash from 'unsplash-js'

const unsplash = new Unsplash({ accessKey: '' })

export type UnsplashPhoto = {
  description: string
  id: string
  urls: {
    raw: string
    regular: string
  }
  user: {
    id: string
    links: {
      html: string
    }
    name: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
    username: string
  }
  views: number
}

type PhotosResponse = {
  pageCount: number
  photos: UnsplashPhoto[]
}

export async function listPhotos(page = 1, perPage = 10): Promise<PhotosResponse> {
  const response = await unsplash.photos.listPhotos(page, perPage, 'latest')
  const photosTotal = Number.parseInt(response.headers.get('X-Total') || '1', 10)
  const photosPerPage = Number.parseInt(response.headers.get('X-Per-Page') || '10', 10)
  const pageCount = Math.ceil(photosTotal / photosPerPage)
  const photos: any[] = await response.json()
  // Views must be fetched independently
  const photoStats = await Promise.all(
    photos.map((photo) =>
      unsplash.photos.getPhotoStats(photo.id)
        .then((response) => response.json())
    )
  )
  const photoViews = photoStats.map((stats) => stats.views?.total || 0)
  photos.forEach((photo, index) => photo.views = photoViews[index])

  return { pageCount, photos }
}
