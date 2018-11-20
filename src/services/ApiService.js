import axios from 'axios'

export class ApiService {
  constructor(baseURL = '/api') {
    this.client = axios.create({
      baseURL,
      withCredentials: true
    })
  }

  /** Creates a server-like api envelope to return local errors */
  makeEnvelope(success, messages, data) {
    return {
      meta: { success, messages },
      data
    }
  }

  /** Wraps an axios request to catch http errors and format in an envelope */
  async makeRequest(config) {
    try {
      let { data } = await this.client(config)
      return data
    } catch (error) {
      if (error.response) return error.response.data
      let msg = 'Something went wrong, please try again'
      return this.makeEnvelope(false, [msg], null)
    }
  }

  /** Perform a 'get' request */
  get(url, config = {}) {
    return this.makeRequest({ url, ...config })
  }

  /** Perform a 'post' request with a json body */
  post(url, data, config = {}) {
    return this.makeRequest({
      method: 'post',
      url,
      data,
      ...config
    })
  }

  /** Perform a 'delete' */
  delete(url, config = {}) {
    return this.makeRequest({
      method: 'delete',
      url,
      ...config
    })
  }
}

export const sharedClient = new ApiService('http://localhost:3000/api')
