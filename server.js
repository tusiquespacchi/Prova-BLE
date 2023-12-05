const noble = require("noble");

const deviceAddress = "00:80:E1:27:AF:BC";
const characteristicUUID = "00000001-cc7a-482a-984a-7f2ed5b3e58f"; // Sostituire con l'UUID corretto

noble.on("stateChange", (state) => {
  if (state === "poweredOn") {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

noble.on("discover", (peripheral) => {
  if (peripheral.address === deviceAddress) {
    connectAndReadData(peripheral);
  }
});

function connectAndReadData(peripheral) {
  peripheral.connect((error) => {
    if (error) {
      console.error(`Errore di connessione: ${error}`);
      return;
    }

    console.log(`Connesso a ${peripheral.address}`);

    peripheral.discoverAllServicesAndCharacteristics(
      (error, services, characteristics) => {
        if (error) {
          console.error(
            `Errore durante la scoperta dei servizi e delle caratteristiche: ${error}`
          );
          peripheral.disconnect();
          return;
        }

        console.log("Servizi trovati:");
        services.forEach((service) => {
          console.log(`  Service UUID: ${service.uuid}`);
        });

        console.log("Caratteristiche trovate:");
        characteristics.forEach((characteristic) => {
          console.log(`  Characteristic UUID: ${characteristic.uuid}`);
        });

        // Trova la caratteristica specifica e leggi i dati
        const dataCharacteristic = characteristics.find(
          (c) => c.uuid === characteristicUUID
        );

        if (!dataCharacteristic) {
          console.error(
            `Caratteristica non trovata con UUID ${characteristicUUID}`
          );
          peripheral.disconnect();
          return;
        }

        dataCharacteristic.read((error, data) => {
          if (error) {
            console.error(`Errore durante la lettura dei dati: ${error}`);
          } else {
            console.log(`Dati ricevuti: ${data.toString("utf-8")}`);
          }

          peripheral.disconnect();
        });
      }
    );
  });
}
