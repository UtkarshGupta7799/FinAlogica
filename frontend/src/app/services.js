import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = import.meta.env.VITE_API_URL

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/api` }),
  endpoints: (builder) => ({
    listSpecies: builder.query({ query: () => '/species' }),
    predict: builder.mutation({
      query: (file) => {
        const form = new FormData()
        form.append('image', file) // <-- must be 'image' to match backend multer
        return { url: '/predict', method: 'POST', body: form }
      }
    }),
    recommend: builder.query({
      query: ({ lat, lon, species }) =>
        `/recommend?lat=${lat}&lon=${lon}&species=${encodeURIComponent(species)}`
    })
  })
})

export const { useListSpeciesQuery, usePredictMutation, useRecommendQuery } = api
