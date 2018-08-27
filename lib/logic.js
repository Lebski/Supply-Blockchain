
'use strict';

var NS = "sc.demonstrator.net";

/**
 * Create car
 * @param {sc.demonstrator.net.CreateCar} CarInfo - Information about new car
 * @transaction
 */
async function executeCreateCar(CarInfo) {

  // Get the asset registry for Person.
  const assetRegistry = await getAssetRegistry(NS + '.Car');

  // Generating new Car
  var factory = getFactory();
  var newCar = factory.newResource(NS, 'Car', CarInfo.productId);

  newCar.status = "ASSEMBLY";
  newCar.holder = CarInfo.issuer;
  newCar.company = CarInfo.issuer.company;

  await assetRegistry.add(newCar)
}

// clear
