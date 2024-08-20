import mockApi from '../../mock-api.json'
import ExtendedMockAdapter from '../../ExtendedMockAdapter'
import axios from 'axios'
const API_BACKEND = import.meta.env.VITE_API_BACKEND

const widgets = mockApi.components.examples.project_dashboard_widgets.value
const projects = mockApi.components.examples.project_dashboard_projects.value

export const ecommerceDashboardApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/dashboards/e-commerce/widgets').reply(() => {
    const getEcommerce = async () => {
      try {
        const { data } = await axios.get(`${API_BACKEND}ecommerce`)
        return data
      } catch (error) {
        console.error('Erro ao buscar estatísticas pendentes:', error)
        throw error
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const ecommerce = await getEcommerce()

        resolve([200, { ...widgets, ...ecommerce }])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })

    return [200, widgets]
  })

  mock.onGet('/dashboards/e-commerce/projects').reply(() => {
    return [200, projects]
  })

  mock.onGet('/dashboards/e-commerce/coupons').reply(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${API_BACKEND}ecommerce/coupons`)
        resolve([200, data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })
}
