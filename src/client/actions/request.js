import axios from 'axios'
import context from '../context'

const request = (options) => {
  return axios({
    ...options,
    baseURL: context + '/api'
  })
  .then(res => res.data)
  .catch(error => {
    let err = error

    if (!(err instanceof Error)) {
      const genericErr = 'Oops something went wrong'
      err = new Error(genericErr)
      err.response = {
        data: {
          error: genericErr,
          messages: []
        },
        status: 500,
        statusText: 'Internal Server Error'
      }
    }

    return Promise.reject(err)
  })
}

export default request
