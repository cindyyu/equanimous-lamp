from string import ascii_uppercase
from random import choice


def random_id(length):
    letters = list(ascii_uppercase)
    numbers = range(0, 10)
    choices = letters + numbers
    result = ""
    for i in range(0, length):
        result += str(choice(choices))
    return result
