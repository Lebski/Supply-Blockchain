from ruuvitag_sensor.ruuvitag import RuuviTag
import sender
import sys, argparse
import json

#MQTT pre_settings
broker = "iot.eclipse.org"
port = 1883
topic = "supply/sensor1"

sensor_mac = "D0:DF:5B:B9:49:03"

def getArgs():
    parser = argparse.ArgumentParser(description='Setting up ruuvi_scan.py')
    parser.add_argument('-s', help='Specify MAC of sensor') # set sensor
    parser.add_argument('--test', help='Check for ruuvis and test functionality') # test ruuvis

    parser.add_argument('-t', help='Your onw topic') # own topic
    parser.add_argument('-c', help='Choose one of the constant topics', choices=['create', 'default', 'shell', 'roof', 'assembly', 'qa', 'ready', 'transport', 'temp', 'velocity', 'arrival', 'sold'] ) # constant topic
    parser.add_argument('-b', help='Choose URL or IP for broker') # broker
    parser.add_argument('-p', help='Choose Port for broker') # Port
    args = parser.parse_args()

    if (args.s != None):
        sensor_mac = args.s
        print ("Sensor MAC set to: ", sensor_mac)
    if (args.t != None):
        topic = args.t
        print ("Topic set to: ", topic)
    elif (args.c != None):
        if (args.c == "default"): topic = "supply/sensor"
        if (args.c == "create"): topic = "manufacturer/createCar"
        if (args.c == "shell"): topic = "manufacturer/arrival/shell"
        if (args.c == "roof"): topic = "manufacturer/arrival/roof"
        if (args.c == "assembly"): topic = "manufacturer/assembly"
        if (args.c == "qa"): topic = "manufacturer/qualityAssurance"
        if (args.c == "ready"): topic = "manufacturer/readyForTransport"
        if (args.c == "transport"): topic = "carrier/transport"
        if (args.c == "tilted"): topic = "carrier/transportation/tilted"
        if (args.c == "temp"): topic = "carrier/transportation/temp"
        if (args.c == "humidity"): topic = "carrier/transportation/humidity"
        if (args.c == "arrival"): topic = "dealer/arrival"
        if (args.c == "sale"): topic = "dealer/sale"
        print ("Topic set to: ", topic)
    if (args.b != None):
        broker = args.b
    if (args.p != None):
        port = args.p

def initMQTT():
    #Setup MQTT sender
    sender.init(broker, port, topic)


def ruuviScan():
    print("Scanning...")
    sensor = RuuviTag(sensor_mac)
    state = sensor.update()
    print(state)
    json_str = '{"uid": "' + str(sensor_mac) + '", "payload": ' + json.dumps(state) + '}'
    print (json_str)
    #sender.send_message(json_str)


print("Startnig to scan...")
ruuviScan()

