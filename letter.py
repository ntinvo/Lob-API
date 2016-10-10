import requests, json
import lob

# API keys
LOB_API_KEY = "test_b3d445043e5b20da2a21b5b383cd09d77f1"
GOOGLE_API_KEY = "AIzaSyBH7ovb41j8HaaYhJqolwW4Ury5dfAL_e0"

# Color and reset
CYAN = '\033[96m'
RESET = '\033[0m'
WARNING = '\033[93m'
RED = '\033[31m'

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
	userInfo["zipcode"] = zipcode
	userInfo["message"] = message
	return userInfo

def getRepContact(userInfo):

	address = userInfo["line1"] + userInfo["line2"] + userInfo["city"] + userInfo["state"] + userInfo["zipcode"]
	address = address.replace(" ", "+")
	url = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&key=" + GOOGLE_API_KEY
	res = requests.get(url)
	res.encoding

	if res.status_code == 200:
		name = res.json()["officials"][0]["name"]
		contact = res.json()["officials"][0]["address"][0]
		contact["name"] = name
		return contact
	else:
		return None

def createAndSendLetter(userInfo, repContact):
	print("GOT HERE")
	
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















