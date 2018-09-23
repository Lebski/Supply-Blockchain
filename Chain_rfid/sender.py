import time, sys
import paho.mqtt.client as mqtt

receiver = "iot.eclipse.org"
port = 1883
max_timeout = 60
topic = "supply/sensor1"


def send_message(msg = "none"):
    client.publish(topic, msg)

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload.decode("utf-8")))

def init (_receiver = receiver, _port = port, _max_timeout = max_timeout, _topic = topic):
    receiver = _receiver
    port = _port
    max_timeout = _max_timeout
    topic = _topic
    client.connect(receiver, port, max_timeout)

client = mqtt.Client()
init()
print ("Mqtt-client initalized")
client.loop_start()
client.on_message = on_message
print ("Mqtt-client ready")

'''while True:
    try:
        send_message("Test @supply")
        time.sleep(2)
    except KeyboardInterrupt:
        print ("Exiting mqtt client...")
        client.loop_stop(force=False)
        print ("Shuting down...")
        sys.exit()
'''
