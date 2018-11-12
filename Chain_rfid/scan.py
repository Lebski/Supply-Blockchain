import RPi.GPIO as GPIO
import MFRC522
import signal
import sender
import numpy
import argparse
import sys, argparse

continue_reading = True

stored_Data = []
in_Data = []


broker = "iot.eclipse.org"
port = 1883
topic = "supply/sensor1"
key = []
auth_skip = False

parser = argparse.ArgumentParser(description='Setting up scan.py')
parser.add_argument('-n', action='store_true', help='No authentication mode (e.g. for NTAG2XX)') # no authentication mode
parser.add_argument('-a', nargs=6, help='Authentication string, comma seperated', type=int) # authentication
parser.add_argument('-t', help='Your onw topic') # own topic
parser.add_argument('-c', help='Choose one of the constant topics', choices=['default', 'assembly', 'qa', 'ready', 'transport', 'arrived', 'forsale', 'sold'] ) # constant topic
parser.add_argument('-b', help='Choose URL or IP for broker') # broker
parser.add_argument('-p', help='Choose Port for broker') # Port
args = parser.parse_args()


if (args.n == True ):
    auth_skip = True
    print ("Authentication is disabled")
elif (args.a != None):
    key = args.a
    print ("Authentication-Key set to: ", key)
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
    if (args.c == "arrival"): topic = "carrier/arrival"
    if (args.c == "temp"): topic = "carrier/transportation/temp"
    if (args.c == "velocity"): topic = "carrier/transportation/velocity"
    if (args.c == "arrival"): topic = "dealer/arrival"
    if (args.c == "sale"): topic = "dealer/sale"
if (args.b != None):
    broker = args.b
if (args.p != None):
    port = args.p

sender.init(broker, port, topic)

# Capture SIGINT for cleanup when the script is aborted
def end_read(signal,frame):
    global continue_reading
    print ("Ctrl+C captured, ending read.")
    continue_reading = False
    GPIO.cleanup()

def stringify(payload):
    #output_str = ''.join(str(chr(i)) for i in payload)
    output_str = ""
    for char in payload:
        if (char != 0):
            output_str += str(chr(char))
    if output_str is "":
        output_str = "empty_payload"
    output_str = '"' + output_str + '"'
    return output_str

# Hook the SIGINT
signal.signl(signal.create, end_read)

# CrCreate createCar
# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

# Welcome message
print ("Press Ctrl-C to stop.")

# This loop keeps checking for chips. If one is near it will get the UID and authenticate
while continue_reading:

    # Scan for cards
    (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

    # Get the UID of the card
    (status,uid) = MIFAREReader.MFRC522_Anticoll()

    # If we have the UID, continue
    if status == MIFAREReader.MI_OK:

        # This is the default key for authentication
        key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]

        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)

        # Authenticate
        if auth_skip is False:
            status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)

        # Check if authenticated
        if status == MIFAREReader.MI_OK or auth_skip:
            in_Data = MIFAREReader.MFRC522_Read(8)
            if (in_Data is not None) and not numpy.array_equal(stored_Data, in_Data):
                stored_Data = in_Data
                print ("Found DATA" + str(in_Data))

                #uid_str = ', '.join('"' + str(i) +  '"' for i in uid)
                #in_Data_str = ', '.join('"' + str(i) +  '"' for i in in_Data)

                json_str = '{"uid": ' + str(uid) + ', "payload": ' + stringify(in_Data) + '}'
                sender.send_message(json_str)
            MIFAREReader.MFRC522_StopCrypto1()
        else:
            print ("Authentication error")
