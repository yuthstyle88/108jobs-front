// lib/axios.ts
import axios from 'axios'
import { getSession } from 'next-auth/react'

// Axios không cần token
export const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Axios có token
export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thêm interceptor cho axiosPrivate
axiosPrivate.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})