#!/bin/bash
cd ..

# Function to generate a random string of specified length
generate_random_string() {
    local length=$1
    tr -dc A-Za-z0-9 </dev/urandom | head -c $length
}

# Check if .env file exists
if [ -f .env ]; then
    read -p ".env file already exists. Do you want to overwrite it? Type 'yes, I want to overwrite it' to confirm: " choice
    if [ "$choice" != "yes, I want to overwrite it" ]; then
        echo "Operation aborted. .env file was not overwritten."
        exit 1
    fi
fi


# Generate random values
SECRET_KEY=$(generate_random_string 6)
DB_USER=$(generate_random_string 8)
DB_PASSWORD=$(generate_random_string 4)
DB_NAME=$(generate_random_string 8)
XMR_API_K=$(generate_random_string 6)

# Create the .env file with the generated values
cat <<EOF > .env
SECRET_KEY=$SECRET_KEY
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
XMR_API_K=$XMR_API_K
EOF

echo ".env file created with random values."
