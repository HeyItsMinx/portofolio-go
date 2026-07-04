import bcrypt
password = input("Password: ").encode()
print(bcrypt.hashpw(password, bcrypt.gensalt()).decode())