#!/bin/bash

# Ensure the scripts are executable
chmod +x ./utilities/genenv.sh
chmod +x ./utilities/start.sh

# Run the generate_environment.sh script
./utilities/genenv.sh
./utilities/start.sh