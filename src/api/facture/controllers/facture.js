'use strict';

/**
 * facture controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::facture.facture', ({ strapi }) => ({
  validate: async (ctx) => {
    const tournee = ctx.request.body.data.tournee
    const saep = ctx.request.header.saep

    const clients = await strapi.db.query('api::client.client').findMany({
      where: {
        tournee
      },
      populate: {
        branchement: true,
        compteur: true,
        adresse: true,
        historique_indices: true,
        factures: true
      }
    });

    const tarifs = await strapi.db.query('api::tarif.tarif').findMany({
      where: {
        saep
      },
      populate: {
        branchement: true
      }
    });

    const date = Date.now()

    for (let client of clients) {
      const solde = client.solde
      const branchement = client.branchement
      const tarif = tarifs.find(tarif => tarif.branchement.code == branchement.code)
      const lastIndex = client.historique_indices.at(-1)?.value
      
      let montant = tarif.prix_base
      if (lastIndex < tarif.volume_1) {
        montant += tarif.prix_1
      }
      if (lastIndex < tarif.volume_2) {
        montant += tarif.prix_2
      }
      if (lastIndex < tarif.volume_3) {
        montant += tarif.prix_3
      }

      await strapi.db.query('api::facture.facture').create({
        data: {
          client: client.id,
          date,
          montant,
          regle: false,
          tournee: tournee,
          encaisse: Math.min(montant, solde),
          saep
        }
      });

      await strapi.db.query('api::facture.facture').update({
        where: {
          tournee
        },
        data: {
          solde: Math.max(0, solde - montant)
        }
      });
    }

    return await strapi.db.query('api::tournee.tournee').update({
      where: {
        id: tournee
      },
      data: {
        facturee: true
      }
    });
  }
}));
