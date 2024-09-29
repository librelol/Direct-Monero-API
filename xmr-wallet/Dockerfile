FROM alpine:latest

# Install dependencies
RUN apk add --no-cache cmake build-base boost-dev openssl-dev libzmq-dev

# Download and build Monero
RUN git clone --recursive https://github.com/monero-project/monero /monero
WORKDIR /monero
RUN make

# Expose necessary ports
EXPOSE 18081 18082

# Start Monero daemon and wallet RPC
CMD ["sh", "-c", "monerod --non-interactive --rpc-bind-ip=0.0.0.0 --rpc-bind-port=18081 & monero-wallet-rpc --rpc-bind-port=18082 --disable-rpc-login --wallet-file /wallet/wallet --password '' --daemon-address http://127.0.0.1:18081"]
