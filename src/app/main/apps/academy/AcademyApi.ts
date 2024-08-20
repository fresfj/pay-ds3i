import apiService from 'app/store/apiService'
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice'
import { PartialDeep } from 'type-fest'

export const addTagTypes = [
  'academy_offer',
  'academy_offers',
  'academy_teachers',
  'academy_teacher',
  'academy_courses',
  'academy_course',
  'academy_categories'
] as const

const AcademyApi = apiService
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getAcademyOffers: build.query<
        GetAcademyOffersApiResponse,
        GetAcademyOffersApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/offers`,
          params: queryArg
        }),
        providesTags: ['academy_offers']
      }),
      getAcademyCashback: build.query<
        GetAcademyCashbackApiResponse,
        GetAcademyCashbackApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/cashback`,
          params: queryArg
        }),
        providesTags: ['academy_offers']
      }),
      getAcademyCashbackItem: build.query<
        GetAcademyCashbackItemApiResponse,
        GetAcademyCashbackItemApiArg
      >({
        query: offerId => ({ url: `/mock-api/academy/cashback/${offerId}` }),
        providesTags: ['academy_offer']
      }),
      getAcademyOffersItem: build.query<
        GetAcademyOffersItemApiResponse,
        GetAcademyOffersItemApiArg
      >({
        query: offerId => ({
          url: `/mock-api/academy/offers/${offerId}`
        }),
        providesTags: ['academy_offer']
      }),
      getAcademyOffersCategories: build.query<
        GetAcademyOffersCategoriesApiResponse,
        GetAcademyOffersCategoriesApiArg
      >({
        query: () => ({ url: `/mock-api/academy/offers/categories` }),
        providesTags: ['academy_categories']
      }),
      getAcademyTeachers: build.query<
        GetAcademyTeachersApiResponse,
        GetAcademyTeachersApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/teachers`,
          params: queryArg
        }),
        providesTags: ['academy_teachers']
      }),
      getAcademyTeacher: build.query<
        GetAcademyTeacherApiResponse,
        GetAcademyTeacherApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/teachers/${queryArg.teacherId}`
        }),
        providesTags: ['academy_teacher']
      }),
      getAcademyCourses: build.query<
        GetAcademyCoursesApiResponse,
        GetAcademyCoursesApiArg
      >({
        query: () => ({ url: `/mock-api/academy/courses` }),
        providesTags: ['academy_courses']
      }),
      getAcademyCourse: build.query<
        GetAcademyCourseApiResponse,
        GetAcademyCourseApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/courses/${queryArg.courseId}`
        }),
        providesTags: ['academy_course']
      }),
      updateAcademyCourse: build.mutation<
        UpdateAcademyCourseApiResponse,
        UpdateAcademyCourseApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/courses/${queryArg.courseId}`,
          method: 'PUT',
          data: queryArg.data
        }),
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled
            dispatch(showMessage({ message: 'Course Saved' }))
          } catch (err) {
            dispatch(showMessage({ message: 'Error Saving the course!' }))
          }
        },
        invalidatesTags: ['academy_courses', 'academy_course']
      }),
      deleteAcademyCourse: build.mutation<
        DeleteAcademyCourseApiResponse,
        DeleteAcademyCourseApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/academy/courses/${queryArg.courseId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['academy_courses']
      }),
      getAcademyCategories: build.query<
        GetAcademyCategoriesApiResponse,
        GetAcademyCategoriesApiArg
      >({
        query: () => ({ url: `/mock-api/academy/categories` }),
        providesTags: ['academy_categories']
      })
    }),
    overrideExisting: false
  })

export default AcademyApi

export type GetAcademyOffersItemApiResponse = /** status 200 User Found */ Offer
export type GetAcademyOffersItemApiArg = string

export type GetAcademyCashbackItemApiResponse =
  /** status 200 User Found */ Offer
export type GetAcademyCashbackItemApiArg = string

export type GetAcademyOffersApiResponse = /** status 200 OK */ Offer[]
export type GetAcademyOffersApiArg = {
  limit?: number
  page?: number
}

export type GetAcademyCashbackApiResponse = /** status 200 OK */ Offer[]
export type GetAcademyCashbackApiArg = {
  limit?: number
  page?: number
}

export type GetAcademyTeachersApiResponse = /** status 200 OK */ Teacher[]
export type GetAcademyTeachersApiArg = {
  type?: number
}
export type GetAcademyTeacherApiResponse = /** status 200 OK */ Teacher
export type GetAcademyTeacherApiArg = {
  teacherId: string
}
export type GetAcademyCoursesApiResponse = /** status 200 OK */ Course[]
export type GetAcademyCoursesApiArg = void
export type GetAcademyCourseApiResponse = /** status 200 OK */ Course
export type GetAcademyCourseApiArg = {
  courseId: string
}

export type UpdateAcademyCourseApiResponse = unknown
export type UpdateAcademyCourseApiArg = {
  courseId: string
  data: PartialDeep<Course>
}

export type DeleteAcademyCourseApiResponse = unknown
export type DeleteAcademyCourseApiArg = {
  courseId: string
}
export type GetAcademyOffersCategoriesApiResponse =
  /** status 200 OK */ Category[]
export type GetAcademyOffersCategoriesApiArg = void

export type GetAcademyCategoriesApiResponse = /** status 200 OK */ Category[]
export type GetAcademyCategoriesApiArg = void

export type Offer = {
  id: string
  establishmentId?: string
  max?: string
  online?: boolean
  visible?: boolean
  establishmentImage?: {
    image: string
    cover: string
  }
  category?: {
    name?: string
  }
  link?: string
  rule?: string
  description?: string

  activeStep: number
  phone?: string
  site: string
  name: string
  title: string
  slug: string
  about: string

  duration: number
  totalSteps: number
  discount: string
  tags: {
    id?: string
    title: string
  }[]
  establishmentAddress?: {
    formatAddress: string
    off: number
    price: number
    title: string
  }
  coupon: string
  rules: string
  benefits: {
    description: string
    rule: string
    summary: string
    active: boolean
  }[]

  progress: {
    currentStep: number
    completed: number
  }
  store?: string
  steps?: {
    content?: string
    title?: string
    subtitle?: string
    order?: number
  }[]
}

export type Teacher = {
  id: string
  phone?: string
  avatar: string
  name: string
  title: string
  slug: string
  description: string
  category: string
  duration: number
  totalSteps: number
  updatedAt: string
  featured: boolean
  tags: {
    id?: string
    title: string
  }[]
  prices: {
    discount: string
    off: number
    price: number
    title: string
  }[]
  progress: {
    currentStep: number
    completed: number
  }
  activeStep?: number
  steps?: {
    content?: string
    title?: string
    subtitle?: string
    order?: number
  }[]
}

export type Course = {
  id: string
  title: string
  slug: string
  description: string
  category: string
  duration: number
  totalSteps: number
  updatedAt: string
  featured: boolean
  progress: {
    currentStep: number
    completed: number
  }
  activeStep?: number
  steps?: {
    content?: string
    title?: string
    subtitle?: string
    order?: number
  }[]
}
export type Category = {
  id: string
  title: string
  slug: string
  color: string
}

export const {
  useGetAcademyOffersQuery,
  useGetAcademyCashbackQuery,
  useGetAcademyOffersItemQuery,
  useGetAcademyCashbackItemQuery,
  useGetAcademyOffersCategoriesQuery,
  useGetAcademyTeachersQuery,
  useGetAcademyTeacherQuery,
  useGetAcademyCoursesQuery,
  useGetAcademyCourseQuery,
  useUpdateAcademyCourseMutation,
  useDeleteAcademyCourseMutation,
  useGetAcademyCategoriesQuery
} = AcademyApi
