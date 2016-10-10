# Color and reset
CYAN = '\033[96m'
RESET = '\033[0m'


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
	return name, address1, address2, city, state, zipcode

def getRepContact(inputs):
	

def main():
	getColor()

	inputs = getUserInputs()
	repContact = getRepContact(inputs)

	resetColor()


if __name__ == '__main__':
	main()















