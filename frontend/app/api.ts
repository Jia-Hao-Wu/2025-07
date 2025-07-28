const api = async (uri: string, options?: RequestInit) =>
  fetch(`http://localhost:3000/api${uri}`, options)

export { api }