#create private key 
openssl genrsa -out private-key.pem 2048

#create certificate and self-sign it with the private key
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
