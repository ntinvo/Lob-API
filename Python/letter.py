import requests, json, sys, lob
from states import states

# API keys
lob.api_key = "test_b3d445043e5b20da2a21b5b383cd09d77f1"
google_api_key = "AIzaSyBH7ovb41j8HaaYhJqolwW4Ury5dfAL_e0"

# Color and reset
CYAN = '\033[96m'
RESET = '\033[0m'
WARNING = '\033[93m'
RED = '\033[31m'
GREEN = '\033[32m'

def setCyanColor():
	'''
	Set the text's color of the terminal to Cyan
	'''
	print(CYAN, end="")


def resetColor():
	'''
	Reset the text's color of the terminal
	'''
	print(RESET, end="")


def greeting():
	'''
	Some greating messages for the program
	'''
	print("\t\t******************************************")
	print("\t\t********** LOB CODING CHALLENGE **********")
	print("\t\t******************************************")
	print(WARNING + "\tPlease Enter Your Information Below And a Message to Your Legislator" + RESET)


def getUserInputs():
	'''
	Prompt the user for input from terminal
	This will return a dictionary contains
	all of infomation related to the user 
	such as name, address, city, state, zip
	and the message to the legislator. 
	'''
	name = input(CYAN + 'Full Name: ')
	address1 = input(CYAN + 'Address Line 1: ')
	address2 = input(CYAN + 'Address Line 2: ')
	city = input(CYAN + 'City: ')
	state = input(CYAN + 'State: ')
	zipcode = input(CYAN + 'Zipcode: ')
	message = input(CYAN + 'Message: ')
	userInfo = {}
	userInfo["name"] = name
	userInfo["line1"] = address1
	userInfo["line2"] = address2
	userInfo["city"] = city
	userInfo["state"] = state
	userInfo["zip"] = zipcode
	userInfo["message"] = message
	return userInfo


def getRepContact(userInfo):
	'''
	Get the representative's contact based
	on the inputs of the user. This will
	return the dictionary contains all of 
	information related to the representative.
	If the status code is anything other than
	200, then returns None because there is 
	some error when making request to Google
	'''
	# Make request to Google to get representative's information
	address = userInfo["line1"] + " " + userInfo["line2"] + " " + userInfo["city"] + " " + userInfo["state"] + " " + userInfo["zip"]
	address = address.replace(" ", "+")
	url = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&key=" + google_api_key
	res = requests.get(url)
	res.encoding

	# Check for error and return
	if res.status_code == 200:
		name = res.json()["officials"][0]["name"]
		contact = res.json()["officials"][0]["address"][0]
		contact["name"] = name
		return contact
	else:
		return None


def createAddress(info):
	'''
	Create the address obj based on the information
	passed in from createAndSendLetter(). This will
	create the address for both the sender and the
	receiver. If there is something wrong when making 
	the request, exit out of the program
	'''
	# Gather infomation
	name = info["name"] if "name" in info else ""
	address_line1 = info["line1"] if "line1" in info else ""
	address_line2 = info["line2"] if "line2" in info else ""
	city = info["city"] if "city" in info else ""
	zipcode = info["zip"] if "zip" in info else ""
	state = info["state"] if "state" in info else ""
	if len(state) != 2 and state.upper() in states:
		state = states[state.upper()]

	# Create address
	try:
		address = lob.Address.create(
			name = name,
			address_line1 = address_line1,
			address_line2 = address_line2,
			address_city = city,
			address_state = state,
			address_zip = zipcode
		)
	except lob.error.InvalidRequestError:
		print(RED + "[ERROR]: Please Check Your Inputs!!! DOUBLE")
		resetColor()
		sys.exit(0)

	return address


def createAndSendLetter(userInfo, repContact):
	'''
	Create the letter to send to the legislator
	based on the user infomation and the rep's 
	information. This will print out the letter's
	url at the end if there is no error.
	'''
	# Create the from and to address
	fromAddress = createAddress(userInfo)
	toAddress = createAddress(repContact)
	
	# Open the letter.html template
	htmlFile = open("letter.html", "r")
	htmlLetter = htmlFile.read().replace("message", userInfo["message"])	

	# Create the letter
	try:
		letter = lob.Letter.create(
			description = "Letter to legislator",
			to_address = toAddress,
			from_address = fromAddress,
			file = htmlLetter,
			color = True
		)
	except:
		print(RED + "[ERROR]: Please Check Your Inputs!!! DOUBLE")
		resetColor()
		htmlFile.close()
		sys.exit(0)

	htmlFile.close()
	print(WARNING + "\t\t\t\tLetter URL:" + RESET)
	print(GREEN + letter.url)


def main():
	'''
	This is like a controller, it will 
	appropriate functions from getting 
	user's info, rep's infor to creating
	addresses and sending the letter.
	'''
	# Set color and greating
	setCyanColor()
	greeting()

	# Main program
	try:
		userInfo = getUserInputs()
		repContact = getRepContact(userInfo)
		if repContact is None:
			print(RED + "[ERROR]: Please Check Your Inputs!!!")
		else:
			createAndSendLetter(userInfo, repContact)
	except:
		resetColor()
		sys.exit(0)

	# Reset color
	resetColor()


if __name__ == '__main__':
	main()