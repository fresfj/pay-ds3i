import _ from '@lodash'
import mockApi from '../mock-api.json'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import { Course } from '../../app/main/apps/academy/AcademyApi'
import firebase from 'firebase/compat/app'
import axios from 'axios'
const API_URL = 'https://node.clubecerto.com.br/superapp/companyAPI/'
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODY4ODUsImNvbXBhbnkiOjI1MjUsImlhdCI6MTcxNzA4MzA4N30.3k94DrgFTzo06_x5VUfbISCQ2VnOZZXp9xx3r7cPtfY'

const demoCourseContent =
  mockApi.components.examples.academy_demo_course_content.value
const exampleCourseSteps =
  mockApi.components.examples.academy_demo_course_steps.value

const steps = exampleCourseSteps.map(item => ({
  ...item,
  content: `${item.content}`
}))
const courses = mockApi.components.examples.academy_courses.value
const categoriesDB = mockApi.components.examples.academy_categories.value

const coursesDB = courses.map(course => ({
  ...course,
  steps
}))

export const academyApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/academy/offers').reply(async config => {
    const { limit, page } = config.params as Params
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `${API_URL}establishment/search?limit=${limit}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${TOKEN}` }
          }
        )
        resolve([200, response.data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/academy/offers/:offerId').reply(async config => {
    const { offerId } = config.params as Params

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${API_URL}establishment/${offerId}`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        })
        resolve([200, response.data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/academy/offers/categories').reply(async config => {
    const { type } = config.params as Params
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${API_URL}establishment/categories`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        })
        resolve([200, response.data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/academy/cashback').reply(async config => {
    const { limit, page } = config.params as Params
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `${API_URL}cashback?limit=${limit}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${TOKEN}` }
          }
        )
        resolve([200, response.data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/academy/cashback/:offerId').reply(async config => {
    const { offerId } = config.params as Params

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${API_URL}cashback/${offerId}`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        })
        resolve([200, response.data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/academy/teachers').reply(async config => {
    const { type } = config.params as Params

    const teachersRef = firebase
      .firestore()
      .collection('teachers')
      .where('type', '==', type)

    return new Promise(async (resolve, reject) => {
      await teachersRef
        .get()
        .then(async querySnapshot => {
          const customersDB = querySnapshot.docs.map((doc, index) => doc.data())
          resolve([200, customersDB])
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onGet('/academy/teachers/:teacherId').reply(async config => {
    const { teacherId } = config.params as Params

    const teacherRef = firebase
      .firestore()
      .collection('teachers')
      .doc(teacherId)
    return new Promise(async (resolve, reject) => {
      await teacherRef
        .get()
        .then(async doc => {
          if (doc.exists) {
            resolve([200, doc.data()])
          } else {
            reject([404, 'Requested customer do not exist.'])
          }
        })
        .catch(error => {
          reject([500, error])
        })
    })
  })

  mock.onGet('/academy/courses').reply(() => {
    return [200, coursesDB]
  })

  mock.onGet('/academy/courses/:courseId').reply(config => {
    const { courseId } = config.params as Params
    const course = _.find(coursesDB, { id: courseId })

    if (!course) {
      return [404, 'Requested data do not exist.']
    }

    return [200, course]
  })

  mock.onPut('/academy/courses/:courseId').reply(config => {
    const { courseId } = config.params as Params

    const course = _.find(coursesDB, { id: courseId }) as Course

    const newData = JSON.parse(config.data as string) as Course

    if (!course) {
      return [404, 'Requested data do not exist.']
    }

    _.assign(course, _.merge({}, course, newData))

    if (newData?.progress?.currentStep === course?.totalSteps) {
      _.assign(
        course,
        _.merge({}, course, {
          progress: { completed: course.progress.completed + 1 }
        })
      )
    }

    return [200, course]
  })

  mock.onGet('/academy/categories').reply(() => {
    return [200, categoriesDB]
  })
}
