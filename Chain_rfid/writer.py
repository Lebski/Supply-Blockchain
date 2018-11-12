import RPi.GPIO as GPIO
import MFRC522
import signal
import random

continue_reading = True

# Capture SIGINT for cleanup when the script is aborted
def end_read(signal,frame):
    global continue_reading
    print ("Ctrl+C captured, ending read.")
    continue_reading = False
    GPIO.cleanup()

def unistringify(input_string):
    fill_count = 0
    if len(input_string) > 16:
        input_string = input_string[:16]
    elif len(input_string) < 16:
        input_string += "0" * (16 - len(input_string))

    payload_arr = []
    for letter in input_string:
        payload_arr.append(ord(letter))
    return payload_arr



def generateData():
    random_number = random.randint(3000,4000)
    print ("Generated Id: car" + random_number)
    return unistringify("car" + str(random_number))

# Hook the SIGINT
signal.signal(signal.SIGINT, end_read)

# Create an object of the class MFRC522
MIFAREReader = MFRC522.MFRC522()

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

        # Print UID
        print ("UID: %s,%s,%s,%s" % (uid[0], uid[1], uid[2], uid[3]))

        # This is the default key for authentication
        key = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF]

        # Select the scanned tag
        MIFAREReader.MFRC522_SelectTag(uid)

        # Authenticate
        status = MIFAREReader.MFRC522_Auth(MIFAREReader.PICC_AUTHENT1A, 8, key, uid)
        #print ("\n")

        # Check if authenticated
        if status == MIFAREReader.MI_OK:

            print ("Sector 8 looked like this:")
            # Read block 8
            oldstatus = MIFAREReader.MFRC522_Read(8)
            print (oldstatus)

            data = generateData()
            # Write the data
            MIFAREReader.MFRC522_Write(8, data)

            print ("It now looks like this:")
            # Check to see if it was written
            newstatus = MIFAREReader.MFRC522_Read(8)
            print (newstatus)

            # Stop
            MIFAREReader.MFRC522_StopCrypto1()

            # Make sure to stop reading for cards
            continue_reading = False
        else:
            print ("Authentication error")
