module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/factures/validate',
      handler: 'api::facture.facture.validate',
      config: {
        auth: false,
      },
    }
  ]
}