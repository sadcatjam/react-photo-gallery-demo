import { UnsplashPhoto } from './Unsplash'

type PhotosResponse = {
  pageCount: number
  photos: UnsplashPhoto[]
}

export async function listPhotos(page = 1, perPage = 10): Promise<PhotosResponse> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const urls = [
    '../src/assets/vinyl.jpg',
    '../src/assets/gachibass.jpg'
  ]

  return {
    pageCount: 120000,
    photos: Array(perPage).fill(undefined).map((e, i) => ({
      description: '',
      id: (i + 1).toString(),
      user: {
        id: 'asd', links: { html: '' }, profile_image: { large: '', medium: '', small: '' },
        name: 'Name Surname', username: 'username'
      },
      urls: { raw: '', regular: urls[i % 2] },
      views: 123
    }))
  }
}
