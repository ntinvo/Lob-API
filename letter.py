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

def getColor():
	print(CYAN, end="")

def resetColor():
	print(RESET, end="")

def getUserInputs():
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
	address = userInfo["line1"] + " " + userInfo["line2"] + " " + userInfo["city"] + " " + userInfo["state"] + " " + userInfo["zip"]
	address = address.replace(" ", "+")
	url = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&key=" + google_api_key
	res = requests.get(url)
	res.encoding

	if res.status_code == 200:
		name = res.json()["officials"][0]["name"]
		contact = res.json()["officials"][0]["address"][0]
		contact["name"] = name
		return contact
	else:
		return None

def createAddress(info):
	# Check and get infomation
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
	fromAddress = createAddress(userInfo)
	toAddress = createAddress(repContact)

	htmlFile = open("letter.html", "r")
	htmlLetter = htmlFile.read().replace("message", userInfo["message"])	

	letter = lob.Letter.create(
		description = "Letter to legislator",
		to_address = toAddress,
		from_address = fromAddress,
		file = htmlLetter,
		color = True
	)
	htmlFile.close()
	print(GREEN + letter.url)

def main():
	# Set the color to CYAN
	getColor()

	# Get user's information
	userInfo = getUserInputs()

	# Get representative's information
	repContact = getRepContact(userInfo)

	# Check to see if we can find the rep's info
	if repContact is None:
		print(RED + "[ERROR]: Please Check Your Inputs!!!")
	else:
		createAndSendLetter(userInfo, repContact)

	# Reset terminal's color
	resetColor()

if __name__ == '__main__':
	main()