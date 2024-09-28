# Use the official Alpine base image
FROM alpine:latest

# Install dependencies and Monero
RUN apk update && \
    apk add --no-cache \
    wget \
    gnupg \
    bash && \
    echo "https://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache monero

# Create the /wallet directory and ensure it is writable
RUN mkdir -p /wallet && chmod 777 /wallet

# Create a passwordless wallet
RUN monero-wallet-cli --generate-new-wallet /wallet/mywallet --password "" --mnemonic-language English --log-file /dev/null <<EOF
exit
EOF

# Expose the default Monero wallet RPC port
EXPOSE 18082

# Set the entrypoint to the Monero wallet RPC
ENTRYPOINT ["monero-wallet-rpc"]

# Default command to run the wallet RPC with a specified wallet file and no password
CMD ["--wallet-file", "/wallet/mywallet", "--rpc-bind-port", "18082", "--disable-rpc-login", "--password", "", "--daemon-address", "monero_daemon:18081"]