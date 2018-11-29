import time, sys
import paho.mqtt.client as mqtt


max_timeout = 60
topic = "None"

def send_message(msg = "none"):
    print (topic)
    client.publish(topic, msg)

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload.decode("utf-8")))

def init (_receiver , _port, _topic):
    receiver = _receiver
    port = int(_port)
    global topic
    topic = _topic
    client.connect(receiver, port, max_timeout)
    print ("Mqtt-client initalized")
    client.on_message = on_message
    client.loop_start()
    print ("Mqtt-client ready")

client = mqtt.Client()
