# React Photo Gallery Demo

Basic photo gallery with [Unsplash API](https://unsplash.com/developers)
integration, built with React and Typescript. Unsplash API requires registration
and is limited to 50 requests per hour.

## Notable features

- Adaptive layout.
- Pagination.
- Swiping pages on touch devices.
- Complex page list scrolling animation.

## Usage

```
npm i
npm run serve
```

Unsplash API key should be put in `src/api/Unsplash.ts`.

To use mock data replace `Unsplash.listPhotos` with `UnsplashMock.listPhotos`
in `App.tsx`.

## TODO

- Page swiping using mouse.
