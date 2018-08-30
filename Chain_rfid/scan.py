import RPi.GPIO as GPIO
import MFRC522
import signal
import sender
import numpy
continue_reading = True
sender.init()

stored_Data = []
in_Data = []


# Capture SIGINT for cleanup when the script is aborted
def end_read(signal,frame):
    global continue_reading
    print ("Ctrl+C captured, ending read.")
    continue_reading = False
    GPIO.cleanup()

# Hook the SIGINT
signal.signal(signal.SIGINT, end_read)

# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

# Welcome message
print ("Welcome to the MFRC522 data read example")
print ("Press Ctrl-C to stop.")

# This loop keeps checking for chips. If one is near it will get the UID and authenticate
while continue_reading:

    # Scan for cards
    (status,TagType) = MIFAREReader.MFRC522_Request(MIFAREReader.PICC_REQIDL)

    # If a card is found
    if status == MIFAREReader.MI_OK:
        print ("Card detected")

    # Get the UID of the card
    (status,uid) = MIFAREReader.MFRC522_Anticoll()


    # If we have the UID, continue
    if status == MIFAREReader.MI_OK:


        #sender.send_message("Card read UID: %s,%s,%s,%s" % (uid[0], uid[1], uid[2], uid[3]))
        print ("Message sent!")

        # This is the default key for authentication
        key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]

        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)

        # Authenticate
        status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)

        # Check if authenticated
        if status == MIFAREReader.MI_OK:
            in_Data = MIFAREReader.MFRC522_Read(8)
            if not numpy.array_equal(stored_Data, in_Data):
                stored_Data = in_Data
                print ("Found DATA" + str(in_Data))

                uid_str = ', '.join('"' + str(i) +  '"' for i in uid)
                in_Data_str = ', '.join('"' + str(i) +  '"' for i in in_Data)

                json_str = '{"uid": [' + uid_str + '], "payload": ' + in_Data_str + '}'
                sender.send_message(json_str)
            MIFAREReader.MFRC522_StopCrypto1()
        else:
            print ("Authentication error")
