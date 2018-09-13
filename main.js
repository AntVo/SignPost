// Bootstrapped with Google's Teachable-Machine-Boilerplate
// 

import {KNNImageClassifier} from 'deeplearn-knn-image-classifier';
import * as dl from 'deeplearn';
import io from 'socket.io-client';

// INPUT SOCKET SERVER HERE
const socket = io('https://explevi.serveo.net');


socket.on('emitAudio', function (data) {
   const hello = new SpeechSynthesisUtterance(data);
   window.speechSynthesis.speak(hello);
});

// Number of classes to classify
const NUM_CLASSES = 7;
// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;
let currentSign = null; 

class Main {
  constructor(){
    // Initiate variables
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;
    
    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new KNNImageClassifier(NUM_CLASSES, TOPK);
    
    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('hidden', 'hidden');
    
    // Add video element to DOM
    document.body.appendChild(this.video);
    
    // Create training buttons and info texts    
    for(let i=0;i<NUM_CLASSES; i++){
      const div = document.createElement('div');
      div.className = "training";
      document.body.appendChild(div);
      div.style.marginBottom = '10px';

      // Create training button
      const button = document.createElement('button')
      button.innerText = "Train "+i;
      div.appendChild(button);

      // Listen for mouse events when clicking the button
      button.addEventListener('mousedown', () => this.training = i);
      button.addEventListener('mouseup', () => this.training = -1);
      
      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " No examples added";
      div.appendChild(infoText);
      this.infoTexts.push(infoText);
    }
    
    
    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.width = IMAGE_SIZE;
      this.video.height = IMAGE_SIZE;

      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })
    
    // Load knn model
    this.knn.load()
    .then(() => this.start()); 
  }
  
  start(){
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
  
  stop(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }
  
  animate(){
    if(this.videoPlaying){
      // Get image data from video element
      const image = dl.fromPixels(this.video);
      
      // Train class if one of the buttons is held down
      if(this.training != -1){
        // Add current image to classifier
        this.knn.addImage(image, this.training)
      }
      
      // If any examples have been added, run predict
      const exampleCount = this.knn.getClassExampleCount();
      if(Math.max(...exampleCount) > 0){
        this.knn.predictClass(image)
        .then((res)=>{
          switch(res.classIndex){
            case 0:
              if (currentSign != 0 && res.confidences[0]*100 > 83){
                currentSign = 0;
                socket.emit('emitAudio', 'hello');
              }
              break;
            case 1:
              if (currentSign != 1 && res.confidences[1]*100 > 83){
                socket.emit('emitAudio', 'world');
                currentSign = 1;
              }
              break;
            case 2:
              if (currentSign != 2 && res.confidences[2]*100 > 80){
                socket.emit('emitAudio', 'lets');
                currentSign = 2;
              }   
              break;         
            case 3:
              if (currentSign != 3 && res.confidences[3]*100 > 83){
                socket.emit('emitAudio', 'give');
                currentSign = 3;
              }            
              break;
            case 4:
              if (currentSign != 4 && res.confidences[4]*100 > 83){
                socket.emit('emitAudio', 'everyone');
                currentSign = 4;
              }
              break;
            case 5:
              if (currentSign != 5 && res.confidences[5]*100 > 83){
                socket.emit('emitAudio', 'a');
                currentSign = 5;
              }
            break;  
            case 6:
              if (currentSign != 6 && res.confidences[6]*100 > 83){
                socket.emit('emitAudio', 'voice');
                currentSign = 6;
              }
            break;
          }

          for(let i=0;i<NUM_CLASSES; i++){
            // Make the predicted class bold
            if(res.classIndex == i){
              this.infoTexts[i].style.fontWeight = 'bold';
            } else {
              this.infoTexts[i].style.fontWeight = 'normal';
            }

            // Update info text
            if(exampleCount[i] > 0){
              this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i]*100}%`
            }
          }
        })
        // Dispose image when done
        .then(()=> image.dispose())
      } else {
        image.dispose()
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}

window.addEventListener('load', () => new Main());