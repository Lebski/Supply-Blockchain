# Supply-Blockchain

### Overview ###

The _Supply Blockchain_ Project is a feasibility study to explore how an industrial supply-chain can be implemented with blockchain technology. Particularly, we use an example from the automobile industry. 

We also simulate the transportation and the selling of the car. 

This project uses the hyperledger fabric blockchain together with the hyperledger composer tool. 

## Supply-Blockchain Sender

### Overview ###

With the provided source code we handle the sensors for the [Supply-Chain](https://github.com/Lebski/Supply-Blockchain) project. 
We use the MFRC522 Sensor with multiple Raspberry Pi. Each time the Sensor is triggered, we send a JSON object to a MQTT broker. 
A HTTP POST-Request will soon be possible. 

The Project uses some code-snipptes from [MFRC522-python](https://github.com/mxgxw/MFRC522-python)

### Prerequisites ###

python3, git, python-pip3, python-dev, build-essential 

### Installation ###

```bash
sudo pip3 install RPi.GPIO
# also possible: python3 -m pip install RPi.GPIO
printf "device_tree_param=spi=on \ndtoverlay=spi-bcm2708\n" >>  /boot/config.txt
sudo raspi-config 
# Now you have to choose "Advanced Options > SPI"
sudo reboot

git clone https://github.com/lthiery/SPI-Py.git 
cd SPI-Py 
#It is super important to INSTALL WITH PYTHON3
sudo python3 setup.py install 
pip3 install paho-mqtt python-etcd
cd .. 
git clone https://github.com/Lebski/Supply-Blockchain
```

### Run ###

```
cd Supply-Blockchain/Chain_rfid
python3 scan.py 
```
In another terminal you can run the `listener.py`. It listens to the default settings of `scan.py`(no flags needed). 
These are the presettings: 

receiver = "iot.eclipse.org" 	
port = 1883 			
max_timeout = 60
topic = "supply/sensor1"	

And then run the Skript: 
```
python3 listener.py
```

