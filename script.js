
// initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyCl3PKvu_paZ3RQRw_OTxeWbD9LtF2nxPU",
  authDomain: "you-according-to-you.firebaseapp.com",
  projectId: "you-according-to-you",
  storageBucket: "you-according-to-you.appspot.com",
  messagingSenderId: "953489391484",
  appId: "1:953489391484:web:221f6f8b420cf5e211aef9",
  measurementId: "G-F43NLCPQWX",
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// global variables;
let theBody = document.getElementsByTagName('body')[0];
let submit = document.querySelector('#submitReflection');
let about = document.getElementById('about');
let aboutClose = document.getElementById('aboutClose');
let idCount = 0; 
let chosenQuesiton;
let textArea = document.querySelector('#userReflection');
let colors = ['#BBBF3F', '#F25835', '#D95284', '#F2E52E', '#8C1F5B', '#576D7B', '#498FCB', '#F22E2E'];
let questionColors = ['#9552F2', '#0B9ED9', '#03A696'];

// retrieve today's question
function pickQuestion(){
    let numQs = 41;
    let questionContainer = document.getElementById('question');
    let questionId = daysSince()%numQs;
    let docRef = db.collection('questions').doc(questionId.toString());
    docRef.get().then((doc) => {
        questionContainer.innerHTML = "<h1>" + doc.data().question + "</h1>";
        chosenQuestion = doc.data().question;
        let bgColor = questionColors[Math.floor(Math.random()*questionColors.length)];
        questionContainer.style.backgroundColor = bgColor;
    })
  };

function daysSince(){
  // proj start date is March 29, 2021. Subtract 1 from month in javascript
  var startDate = new Date(2021, 2, 29);
  let currentDate = new Date();
  var oneDay = 24 * 60 * 60 * 1000;

  var diffDays = Math.round(Math.abs((startDate - currentDate) / oneDay));
  return diffDays;
}

function todaysDate(){
  var d = new Date();
  // new collection per day
  var theDate = d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate();
  return theDate;
}

// on submit 
function addReflection(){

  let reflectionContainer = document.querySelector("#reflectionContainer");

  let textArea = document.querySelector('#userReflection');
  let userReflection = textArea.value; 

  let reflection = document.createElement('span');
  reflection.classList.add('reflection');
  reflection.innerHTML = userReflection;
  reflection.id = 'reflection_' + idCount;
  let chosenColor = colors[Math.floor(Math.random()*colors.length)]
  reflection.style.backgroundColor = chosenColor;

  reflectionContainer.appendChild(reflection);

  // add to database
  var d = new Date();
  // new collection per day
  var collectionName = todaysDate();
  var submitTime = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  db.collection(collectionName).add({
    question: chosenQuestion,
    response: userReflection,
    time: submitTime,
    color: chosenColor
  })
}

function loadReflections(){
  db.collection(todaysDate()).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // create divs and add them to the field
      let reflectionContainer = document.querySelector("#reflectionContainer");

     let userReflection = doc.data().response; 
     let bgColor = doc.data().color;

      let reflection = document.createElement('span');
      reflection.classList.add('reflection');
      reflection.id = 'reflection_' + idCount;
      reflection.innerHTML = userReflection;
      reflection.style.backgroundColor = bgColor;

      reflectionContainer.appendChild(reflection);
      idCount += 1;
    })
  })
}

textArea.addEventListener("keydown", function(e){
  if (e.keyCode === 13){
      e.preventDefault();
      submitted();
  }
})

function submitted(){
  if (textArea.value == ""){
    let placeholders = ["Don't be shy", "Let it out", "Take a moment for you", "We want to get to know you", "Be vulnerable"];
    let randomNum = Math.floor(Math.random() * placeholders.length);
    textArea.placeholder = placeholders[randomNum];
  } else {
    addReflection();
    let closeUs = document.querySelectorAll('.toClose');
    closeUs.forEach(function(elem){
      elem.style.display = 'none'
    })
    document.getElementById('toAdd').style.display = 'block';
  }
}

about.onclick = function(){
  let aboutPopUp = document.getElementById('aboutPopUp');
  aboutPopUp.style.display = 'block';
}

aboutClose.onclick = function(){
  let aboutPopUp = document.getElementById('aboutPopUp');
  aboutPopUp.style.display = 'none';
}


function authenticate(){
  firebase.auth().signInAnonymously()
    .then(() => {
      pickQuestion();
      loadReflections();
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorCode, errorMessage);
  });
}

authenticate()


  
  

