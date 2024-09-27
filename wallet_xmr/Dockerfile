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

# Expose the default Monero wallet RPC port
EXPOSE 18082

# Set the entrypoint to the Monero wallet RPC
ENTRYPOINT ["monero-wallet-rpc"]

# Default command to run the wallet RPC with a specified wallet file
CMD ["--wallet-file", "/wallet-file", "--rpc-bind-port", "18082", "--disable-rpc-login"]
