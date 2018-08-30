
'use strict';
// 9742 owner
// CAR_One
var NS = "sc.demonstrator.net";
/*
/**
 * Create car
 * @param {sc.demonstrator.net.Setup}  - Information about new car
 * @transaction
 */
 /*
 async function executeCreateCar(CarInfo) {
  await executeCreateCar


}*/

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

  await assetRegistry.add(newCar);
}


/**
 * Assemble Car and add Roof, Shell
 * @param {sc.demonstrator.net.Assembly} Parts - Car parts to assemble
 * @transaction
 */
async function executeAssembly(Parts) {

  // Get the asset registry for Person.
  const assetRegistry = await getAssetRegistry(NS + '.Car');

  Parts.car.status = "ASSEMBLY";
  Parts.car.roof = Parts.roof;
  Parts.car.shell = Parts.shell;

  await assetRegistry.update(Parts.car);
}

/**
 * Do a QA-Check
 * @param {sc.demonstrator.net.QACheck} QAInfo - Information about the QACheck
 * @transaction
 */
async function executeQACheck(QAInfo) {

  // Get the asset registry for Person.
  const carRegistry = await getAssetRegistry(NS + '.Car');

  // Generating new Car
  var factory = getFactory();
  var newReport = factory.newResource(NS, 'QAReport', QAInfo.qaId);

  newReport.lightCheck = QAInfo.lightCheck
  newReport.hornCheck = QAInfo.hornCheck

  QAInfo.car.status = "QA";
  if (QAInfo.car.qAReport != null) {
    QAInfo.car.qAReport.push(newReport);
  } else {
    QAInfo.car.qAReport = [newReport]
  }
  await carRegistry.update(QAInfo.car);
}
// clear

/**
 * Make Car ready for Transport
 * @param {sc.demonstrator.net.ReadyForTransport} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportReady(TransportInfo) {

  if (TransportInfo.car.status !== "QA") {
    throw new Error('QA-Check must have been processed');
  } else {
    lastReport TransportInfo.car.qAReport[TransportInfo.car.qAReport.length - 1]
    if (!lastReport.lightCheck) throw new Error('>lightCheck was processed and a fault was found, run QA again');
    if (!lastReport.hornCheck) throw new Error('>hornCheck was processed and a fault was found, run QA again');
  }

  // Get the asset registry for Person.
  const carRegistry = await getAssetRegistry(NS + '.Car');

  // Generating new Car
  var factory = getFactory();
  var newReport = factory.newResource(NS, 'TransportReport', TransportInfo.transId);

  newReport.tilted = 0;
  newReport.acceleration = 0;

  TransportInfo.car.status = "READYFORTRANSPORT";
  TransportInfo.car.transportReport = newReport;

  await carRegistry.update(TransportInfo.car);
}


/**
 * Transport Car
 * @param {sc.demonstrator.net.TransportStart} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportStart(TransportInfo) {

  const carRegistry = await getAssetRegistry(NS + '.Car');


  TransportInfo.car.status = "TRANSPORT";

  await carRegistry.update(TransportInfo.car);
}

/**
 * Update Sensor Data
 * @param {sc.demonstrator.net.SensorStatusUpdate} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportSensorStatusUpdate(TransportInfo) {

  const carRegistry = await getAssetRegistry(NS + '.Car');

  if (TransportInfo.tilted > 0) {
  TransportInfo.car.transportReport.tilted = TransportInfo.tilted;
  }
  if (TransportInfo.acceleration > 0) {
  TransportInfo.car.transportReport.acceleration = TransportInfo.acceleration;
  }

  await carRegistry.update(TransportInfo.car);
}

/**
 * Car has arrived
 * @param {sc.demonstrator.net.TransportStop} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportStop(TransportInfo) {

  const carRegistry = await getAssetRegistry(NS + '.Car');

  TransportInfo.car.status = "ARRIVED";

  await carRegistry.update(TransportInfo.car);
}

/**
 * Car changed ownership after transport
 * @param {sc.demonstrator.net.TakeOverFromTransport} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTakeOverFromTransport(TransportInfo) {

  const carRegistry = await getAssetRegistry(NS + '.Car');


  TransportInfo.car.status = "FORSALE";

  await carRegistry.update(TransportInfo.car);
}

/**
 * Car is sold
 * @param {sc.demonstrator.net.Sold} TransactionInfo - Info about the Transport
 * @transaction
 */
async function executeTakeOverFromTransport(TransactionInfo) {

  const carRegistry = await getAssetRegistry(NS + '.Car');


  TransactionInfo.car.status = "SOLD";

  await carRegistry.update(TransactionInfo.car);
}
