import mockApi from '../../mock-api.json'
import ExtendedMockAdapter from '../../ExtendedMockAdapter'
import axios from 'axios'
import format from 'date-fns/format'
import { addMonths, endOfMonth, startOfMonth, subDays } from 'date-fns'
const API_BACKEND = import.meta.env.VITE_API_BACKEND
const widgets = mockApi.components.examples.finance_dashboard_widgets.value

export const financeDashboardApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/dashboards/finance/widgets').reply(() => {
    const currentDate = new Date()
    const firstDayOfMonth = startOfMonth(currentDate)
    const lastDayOfMonth = endOfMonth(currentDate)

    const firstDayOfPreviousMonth = startOfMonth(addMonths(currentDate, -1))
    const lastDayOfPreviousMonth = endOfMonth(addMonths(currentDate, -1))

    const getStatistics = async (status, firstDayOfMonth, lastDayOfMonth) => {
      try {
        const { data } = await axios.get(`${API_BACKEND}finance/statistics`, {
          params: {
            'dueDate[ge]': format(firstDayOfMonth, 'yyyy-MM-dd'),
            'dueDate[le]': format(lastDayOfMonth, 'yyyy-MM-dd'),
            status
          }
        })

        return data
      } catch (error) {
        console.error('Erro ao buscar estatísticas pendentes:', error)
        throw error
      }
    }

    const getBalance = async () => {
      try {
        const { data } = await axios.get(`${API_BACKEND}finance/balance`)
        return data
      } catch (error) {
        console.error('Erro ao buscar estatísticas pendentes:', error)
        throw error
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const pending = await getStatistics(
          'PENDING',
          firstDayOfMonth,
          lastDayOfMonth
        )

        const confirmed = await getStatistics(
          'CONFIRMED',
          firstDayOfMonth,
          lastDayOfMonth
        )

        const confirmedPrevious = await getStatistics(
          'CONFIRMED',
          firstDayOfPreviousMonth,
          lastDayOfPreviousMonth
        )

        const overdue = await getStatistics(
          'OVERDUE',
          firstDayOfMonth,
          lastDayOfMonth
        )

        const overduePrevious = await getStatistics(
          'OVERDUE',
          firstDayOfPreviousMonth,
          lastDayOfPreviousMonth
        )

        const balance = await getBalance()
        const statistics = {
          pending,
          confirmed,
          confirmedPrevious,
          overdue,
          overduePrevious
        }

        resolve([200, { ...widgets, statistics, balance }])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/dashboards/finance').reply(async () => {
    const currentDate = new Date()
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${API_BACKEND}finance/transactions`, {
          params: {
            startDate: format(subDays(currentDate, 7), 'yyyy-MM-dd'),
            finishDate: format(currentDate, 'yyyy-MM-dd'),
            offset: 0,
            limit: 10
          }
        })
        resolve([200, data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/dashboards/finance/subscriptions').reply(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${API_BACKEND}finance`, {
          params: {
            sort: 'dateCreated',
            status: 'ACTIVE',
            offset: 0,
            limit: 10
          }
        })
        resolve([200, data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })
}
