import { useState, useEffect, useCallback } from 'react'

const useInfiniteScroll = (callback: () => void, delay: number = 1000) => {
  const [isFetching, setIsFetching] = useState(false)

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching
    ) {
      return
    }
    setIsFetching(true)
  }, [isFetching])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!isFetching) return

    const fetchMore = async () => {
      await callback()
      setTimeout(() => {
        setIsFetching(false)
      }, delay)
    }

    fetchMore()
  }, [isFetching, callback, delay])
  return [isFetching, setIsFetching] as const
}

export default useInfiniteScroll
