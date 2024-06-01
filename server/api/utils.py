import random
import string


def generate_invoice_number():
    # Choose a random 3-letter prefix
    prefix = "".join(random.choices(string.ascii_uppercase, k=3))

    # Choose a random 4-digit number
    number = "".join(random.choices(string.digits, k=4))

    return f"{prefix}{number}"
