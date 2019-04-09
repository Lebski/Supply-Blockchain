'use strict';
// 9742 owner
// CAR_One
var NS = "sc.demonstrator.net";

/**
 * Use this Function for setting up each of a kind
 * @param {sc.demonstrator.net.Setup} SetupParam - Yeah basically nothing...
 * @transaction
 */

async function executeSetup(SetupParam) {

  const Car_reg = await getAssetRegistry(NS + '.Car');
  const Company_reg = await getAssetRegistry(NS + '.Company');
  const Roof_reg = await getAssetRegistry(NS + '.Roof');
  const Shell_reg = await getAssetRegistry(NS + '.Shell');
  //const QAReport_reg = await getAssetRegistry(NS + '.QAReport');
  //const TransportReport_reg = await getAssetRegistry(NS + '.TransportReport');
  const Customer_reg = await getParticipantRegistry(NS + '.Customer');
  const Assembly_holder_reg = await getParticipantRegistry(NS + '.Assembly_holder');
  const QA_holder_reg = await getParticipantRegistry(NS + '.QA_holder');
  const Transport_holder_reg = await getParticipantRegistry(NS + '.Transport_holder');
  const Distribution_holder_reg = await getParticipantRegistry(NS + '.Distribution_holder');

  var factory = getFactory();
  var n_Company = factory.newResource(NS, 'Company', "Company_TEST");
  var n_Car = factory.newResource(NS, 'Car', "Car_TEST");
  var n_Roof = factory.newResource(NS, 'Roof', "Roof_TEST");
  var n_Shell = factory.newResource(NS, 'Shell', "Shell_TEST");
  var n_QAReport = factory.newConcept(NS, 'QAReport');
  var n_TransportReport = factory.newConcept(NS, 'TransportReport');
  var n_Customer = factory.newResource(NS, 'Customer', "Customer_TEST");
  var n_Assembly_holder = factory.newResource(NS, 'Assembly_holder', "Assembly_holder_TEST");
  var n_QA_holder = factory.newResource(NS, 'QA_holder', "QA_holder_TEST");
  var n_Transport_holder = factory.newResource(NS, 'Transport_holder', "Transport_holder_TEST");
  var n_Distribution_holder = factory.newResource(NS, 'Distribution_holder', "Distribution_holder_TEST");
  var n_MeasurementTilted = factory.newConcept(NS, 'Measurement');
  var n_MeasurementTemperature = factory.newConcept(NS, 'Measurement');
  var n_MeasurementHumidity = factory.newConcept(NS, 'Measurement');

  n_Company.name = "CAPITALO_INC";
  n_Company.lat = 50.00000;
  n_Company.long = -100.00000;
  n_Car.company = n_Company;
  //n_Car.status = "QA";
  n_Car.holder = n_Assembly_holder;
  // n_Car.Roof = n_Roof;
  // n_Car.Shell = n_Shell;
  n_Car.qAReport = [n_QAReport]
  // n_Car.qAReport.push(n_QAReport); HACK Enable this if you want to add more to the array
  n_Car.transportReport = [n_TransportReport];
  n_Roof.company = n_Company;
  // n_Roof.RoofStatus = "MOUNTED";
  n_Shell.company = n_Company;
  // n_Shell.RoofStatus = "MOUNTED";
  n_QAReport.lightCheck = true;
  n_QAReport.hornCheck = true;
  n_QAReport.issuer = n_QA_holder;
  n_TransportReport.routeHash = "0xdeadbeef";
  n_TransportReport.tilted = [n_MeasurementTilted];
  n_TransportReport.temperature = [n_MeasurementTemperature];
  n_TransportReport.humidity = [n_MeasurementHumidity];
  n_TransportReport.vehicle = "Matchbox";
  n_TransportReport.issuer = n_Transport_holder;
  
  //Measurements
  n_MeasurementTilted.lat = 100.00000;
  n_MeasurementTemperature.lat = 101.00000;
  n_MeasurementHumidity.lat = 102.00000;
  n_MeasurementTilted.long = 100.00000;
  n_MeasurementTemperature.long = 101.00000;
  n_MeasurementHumidity.long = 102.00000;  
  n_MeasurementTilted.measuredValue = 100.00000;
  n_MeasurementTemperature.measuredValue = 101.00000;
  n_MeasurementHumidity.measuredValue = 102.00000;  
  
  
  // n_Customer
  n_Assembly_holder.company = n_Company;
  n_Assembly_holder.lat = 50.00000;
  n_Assembly_holder.long = -100.00000;
  n_QA_holder.company = n_Company;
  n_QA_holder.lat = 50.00000;
  n_QA_holder.long = -100.00000;
  n_Transport_holder.company = n_Company;
  n_Distribution_holder.company = n_Company;
  n_Distribution_holder.lat = 50.00000;
  n_Distribution_holder.long = -100.00000;

  await Car_reg.add(n_Car);
  await Company_reg.add(n_Company);
  await Roof_reg.add(n_Roof);
  await Shell_reg.add(n_Shell);
  await Customer_reg.add(n_Customer);
  await Assembly_holder_reg.add(n_Assembly_holder);
  await QA_holder_reg.add(n_QA_holder);
  await Transport_holder_reg.add(n_Transport_holder);
  await Distribution_holder_reg.add(n_Distribution_holder);


}

/**
 * Create shell
 * @param {sc.demonstrator.net.ShellArrival} ShellInfo - Information about new shell
 * @transaction
 */
async function executeShellArrival(ShellInfo) {

  // Get the asset registry for Shell.
  const assetRegistry = await getAssetRegistry(NS + '.Shell');

  // Generating new Shell
  var factory = getFactory();
  var newShell = factory.newResource(NS, 'Shell', ShellInfo.productId);

  newShell.status = "ONSTOCK";
  newShell.company = ShellInfo.company;

  await assetRegistry.add(newShell);
}


/**
 * Create roof
 * @param {sc.demonstrator.net.RoofArrival} RoofInfo - Information about new roof
 * @transaction
 */
async function executeRoofArrival(RoofInfo) {

  // Get the asset registry for Roof.
  const assetRegistry = await getAssetRegistry(NS + '.Roof');

  // Generating new Roof
  var factory = getFactory();
  var newRoof = factory.newResource(NS, 'Roof', RoofInfo.productId);

  newRoof.status = "ONSTOCK";
  newRoof.company = RoofInfo.company;

  await assetRegistry.add(newRoof);
}

/**
 * Create car
 * @param {sc.demonstrator.net.CreateCar} CarInfo - Information about new car
 * @transaction
 */
async function executeCreateCar(CarInfo) {

  // Get the asset registry for Person.
  const carRegistry = await getAssetRegistry(NS + '.Car');
  const shellRegistry = await getAssetRegistry(NS + '.Shell');


  // Generating new Car
  var factory = getFactory();
  var newCar = factory.newResource(NS, 'Car', CarInfo.productId);

  newCar.status = "ASSEMBLY";
  newCar.holder = CarInfo.issuer;
  newCar.company = CarInfo.issuer.company;
  newCar.shell = CarInfo.shell;
  newCar.shell.status = "MOUNTED";

  await carRegistry.add(newCar);
  await shellRegistry.update(newCar.shell);
}


/**
 * Assemble Car and add Roof, Shell
 * @param {sc.demonstrator.net.Assembly} Parts - Car parts to assemble
 * @transaction
 */
async function executeAssembly(Parts) {

  // Get the asset registry for Car.
  const carRegistry = await getAssetRegistry(NS + '.Car');
  const roofRegistry = await getAssetRegistry(NS + '.Roof');

  Parts.car.status = "ASSEMBLY";
  Parts.car.roof = Parts.roof;
  Parts.car.holder = Parts.issuer;
  Parts.car.roof.status = "MOUNTED";

  await carRegistry.update(Parts.car);
  await roofRegistry.update(Parts.car.roof);
}

/**
 * Do a QA-Check
 * @param {sc.demonstrator.net.QACheck} QAInfo - Information about the QACheck
 * @transaction
 */
async function executeQACheck(QAInfo) {

  // Get the asset registry for Car.
  const carRegistry = await getAssetRegistry(NS + '.Car');

  // Generating new QAReport
  var factory = getFactory();
  var newReport = factory.newConcept(NS, 'QAReport');

  newReport.lightCheck = QAInfo.lightCheck
  newReport.hornCheck = QAInfo.hornCheck
  newReport.issuer = QAInfo.issuer;
    
  QAInfo.car.status = "QA";
  QAInfo.car.holder = QAInfo.issuer;
  
  if (QAInfo.car.qAReport != null) {
    QAInfo.car.qAReport.push(newReport);
  } else {
    QAInfo.car.qAReport = [newReport]
  }
  await carRegistry.update(QAInfo.car);
}

/**
 * Make Car ready for Transport
 * @param {sc.demonstrator.net.ReadyForTransport} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportReady(TransportInfo) {

  if (TransportInfo.car.status !== "QA") {
    throw new Error('QA-Check must have been processed');
  } else {
    var lastReport = TransportInfo.car.qAReport[TransportInfo.car.qAReport.length - 1]
    if (!lastReport.lightCheck) throw new Error('>lightCheck was processed and a fault was found, run QA again');
    if (!lastReport.hornCheck) throw new Error('>hornCheck was processed and a fault was found, run QA again');
  }

  // Get the asset registry for Person.
  const carRegistry = await getAssetRegistry(NS + '.Car');


  TransportInfo.car.status = "READYFORTRANSPORT";


  await carRegistry.update(TransportInfo.car);
}


/**
 * Transport Car
 * @param {sc.demonstrator.net.TransportStart} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportStart(TransportInfo) {

  const carRegistry = await getAssetRegistry(NS + '.Car');
  
  // Generating new TransportReport
  var factory = getFactory();  
  var newReport = factory.newConcept(NS, 'TransportReport');
  
  newReport.vehicle = "Truck_312";
  newReport.issuer = TransportInfo.issuer;
  
  TransportInfo.car.holder = TransportInfo.issuer;
  TransportInfo.car.status = "TRANSPORT";
  
  if (TransportInfo.car.transportReport != null) {
    TransportInfo.car.transportReport.push(newReport);
  } else {
    TransportInfo.car.transportReport = [newReport]
  }
  await carRegistry.update(TransportInfo.car);

  
}

/**
 * Update Sensor Data
 * @param {sc.demonstrator.net.TiltedStatusUpdate} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTiltedSensorStatusUpdate(TransportInfo) {
  // The issuer of the transaction must be the same issuer than in "TransportStart"
  var lastReport = TransportInfo.car.transportReport.length-1;
  if (TransportInfo.car.transportReport[lastReport].issuer == TransportInfo.issuer) {

    const carRegistry = await getAssetRegistry(NS + '.Car');
    
    var factory = getFactory();  
    var newMeasurement = factory.newConcept(NS, 'Measurement');
    
    newMeasurement.lat = TransportInfo.lat;
    newMeasurement.long = TransportInfo.long;
    newMeasurement.measuredValue = TransportInfo.measuredValue;
    
      
    if (TransportInfo.car.transportReport[lastReport].tilted != null) {
      TransportInfo.car.transportReport[lastReport].tilted.push(newMeasurement);
    } else {
     TransportInfo.car.transportReport[lastReport].tilted = [newMeasurement];
    }
  
    await carRegistry.update(TransportInfo.car);
     
    
 //   if (TransportInfo.tilted > 0) {
 //     TransportInfo.car.transportReport.tilted = TransportInfo.tilted;
 //   }
 //   if (TransportInfo.acceleration > 0) {
 //     TransportInfo.car.transportReport.acceleration = TransportInfo.acceleration;
 //   }
 //   if (TransportInfo.temperature > -274) {
 //     TransportInfo.car.transportReport.acceleration = TransportInfo.temperature;
 //   }
 //   if (TransportInfo.file != null) {
 //     TransportInfo.car.transportReport.file = TransportInfo.file;
 //   }

  } else {
    throw new Error('Issuer must be the same "Transport_holder" who also issued the TransportReport for this Vehicle');
  }
}


/**
 * Update Sensor Data
 * @param {sc.demonstrator.net.TemperatureStatusUpdate} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTemperatureSensorStatusUpdate(TransportInfo) {
  // The issuer of the transaction must be the same issuer than in "TransportStart"
  var lastReport = TransportInfo.car.transportReport.length-1;
  if (TransportInfo.car.transportReport[lastReport].issuer == TransportInfo.issuer) {

    const carRegistry = await getAssetRegistry(NS + '.Car');
    
    var factory = getFactory();  
    var newMeasurement = factory.newConcept(NS, 'Measurement');
    
    newMeasurement.lat = TransportInfo.lat;
    newMeasurement.long = TransportInfo.long;
    newMeasurement.measuredValue = TransportInfo.measuredValue;
    
      
    if (TransportInfo.car.transportReport[lastReport].temperature != null) {
      TransportInfo.car.transportReport[lastReport].temperature.push(newMeasurement);
    } else {
     TransportInfo.car.transportReport[lastReport].temperature = [newMeasurement];
    }
  
    await carRegistry.update(TransportInfo.car);
     
  } else {
    throw new Error('Issuer must be the same "Transport_holder" who also issued the TransportReport for this Vehicle');
  }
}


/**
 * Update Sensor Data
 * @param {sc.demonstrator.net.HumidityStatusUpdate} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeHumiditySensorStatusUpdate(TransportInfo) {
  // The issuer of the transaction must be the same issuer than in "TransportStart"
  var lastReport = TransportInfo.car.transportReport.length-1;
  if (TransportInfo.car.transportReport[lastReport].issuer == TransportInfo.issuer) {

    const carRegistry = await getAssetRegistry(NS + '.Car');
    
    var factory = getFactory();  
    var newMeasurement = factory.newConcept(NS, 'Measurement');
    
    newMeasurement.lat = TransportInfo.lat;
    newMeasurement.long = TransportInfo.long;
    newMeasurement.measuredValue = TransportInfo.measuredValue;
    
      
    if (TransportInfo.car.transportReport[lastReport].humidity != null) {
      TransportInfo.car.transportReport[lastReport].humidity.push(newMeasurement);
    } else {
     TransportInfo.car.transportReport[lastReport].humidity = [newMeasurement];
    }
  
    await carRegistry.update(TransportInfo.car);

  } else {
    throw new Error('Issuer must be the same "Transport_holder" who also issued the TransportReport for this Vehicle');
  }
}


/**
 * Car has arrived
 * @param {sc.demonstrator.net.TransportStop} TransportInfo - Info about the Transport
 * @transaction
 */
async function executeTransportStop(TransportInfo) {

  // The issuer of the transaction must be the same issuer than in "ReadyForTransport"
  if (TransportInfo.car.transportReport.issuer == TransportInfo.issuer) {

    const carRegistry = await getAssetRegistry(NS + '.Car');

    TransportInfo.car.status = "ARRIVED";

    await carRegistry.update(TransportInfo.car);
  } else {
    throw new Error('Issuer must be the same "Transport_holder" who also issued the TransportReport for this Vehicle');
  }
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
