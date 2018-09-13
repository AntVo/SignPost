# SignPost
Live gesture recognition for American Sign Language and real time video/audio communication. 

# Technologies used
- Agora.io's Web RTC SDK
- Socket.io
- HTML/CSS/JS
- Tensorflow.js, KNN Image Classifier, Deeplearn.js
- Bootstrapped from Google's [Teachable-Machine](https://github.com/googlecreativelab/teachable-machine)

# Set-up
1) Navigate to root directory. 
2) NPM Start to host the app at localhost:9966
3) In another tab, navigate to the socket_server directory. cd socket_server
3) node socketServer.js to run the socketServer at localhost:3000

-- Optional (Deployment to a proxy web server)
4) navigate to socket_server directory
4a) ssh -R 80:localhost:3000 serveo.net
5) install ngrok on your machine.
5a) ngrok http -bind-tls=true localhost:9966

