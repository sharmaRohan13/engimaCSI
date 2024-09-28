sudo apt update
sudo apt install -y curl

# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v

# Install Python
sudo apt install -y python3 python3-pip

# Verify installation
python3 --version
pip3 --version