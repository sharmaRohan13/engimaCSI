# Navigate to the client directory and start the client server
cd ../client
python3 -m http.server 8000 &

# Navigate to the backend directory and start the backend server
cd ../serverY
npm start