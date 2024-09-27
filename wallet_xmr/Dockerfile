# Use the official Ubuntu base image
FROM ubuntu:20.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

COPY . .

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg2 \
    software-properties-common

# Add the Monero repository and install Monero
RUN wget -qO - https://downloads.getmonero.org/monero.asc | gpg --dearmor -o /usr/share/keyrings/monero-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/monero-archive-keyring.gpg] https://downloads.getmonero.org/repo/ubuntu focal main" | tee /etc/apt/sources.list.d/monero.list && \
    apt-get update && \
    apt-get install -y monero

# Expose the default Monero wallet RPC port
EXPOSE 18082

# Set the entrypoint to the Monero wallet RPC
ENTRYPOINT ["monero-wallet-rpc"]

# Default command to run the wallet RPC with a specified wallet file
CMD ["--wallet-file", "/wallet-file", "--rpc-bind-port", "18082", "--disable-rpc-login"]