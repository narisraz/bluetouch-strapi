module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/historique-indices/validate',
      handler: 'api::historique-index.historique-index.validate',
      config: {
        auth: false,
      },
    }
  ]
}