import mockApi from '../../mock-api.json'
import ExtendedMockAdapter from '../../ExtendedMockAdapter'
import axios from 'axios'
const widgets = mockApi.components.examples.analytics_dashboard_widgets.value
const API_BACKEND = import.meta.env.VITE_API_BACKEND

export const analyticsDashboardApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/dashboards/analytics/widgets').reply(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${API_BACKEND}analytics`)
        resolve([200, data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })
}
