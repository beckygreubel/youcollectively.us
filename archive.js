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
  
var acc = document.getElementsByClassName("accordion");
var i;

function loadArchive(){
    for (let i = 1; i <= daysSince(); i++){
        let date = new Date();
        let questionDate = new Date(new Date().setDate(new Date().getDate() - i))
        let collection = questionDate.getFullYear() + '.' + (questionDate.getMonth()+1) + '.' + questionDate.getDate();
        db.collection(collection).get().then((querySnapshot) => {
          if (querySnapshot.size > 0){
            let entry = document.querySelector(".entry");
            let accordian = document.createElement('button');
            accordian.classList.add('accordion');

            let questionContainer = document.createElement('div');
            questionContainer.classList.add('question');

            let panel = document.createElement('div');
            panel.classList.add('panel');

            let numEntries = document.createElement('div');
            numEntries.classList.add('numEntries');
            let counter = 0;

            accordian.appendChild(questionContainer);
            accordian.appendChild(numEntries);
            entry.appendChild(accordian);
            entry.appendChild(panel);

            accordian.addEventListener("click",function(){
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                  panel.style.maxHeight = null;
                } else {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                }
            })

            querySnapshot.forEach((doc) => {
                counter +=1;

                let userReflection = doc.data().response;
                let question = doc.data().question;

                questionContainer.innerHTML = question;
        
                let reflection = document.createElement('span');
                reflection.classList.add('reflection');
                reflection.style.backgroundColor = doc.data().color;
                reflection.innerHTML = userReflection;

                panel.appendChild(reflection);
                numEntries.innerHTML = "[" + counter + "]";
            });
          }

        });
    }
}

function daysSince(){
    // proj start date is March 29, 2021. Subtract 1 from month in javascript
    var startDate = new Date(2021, 2, 29);
    let currentDate = new Date();
    var oneDay = 24 * 60 * 60 * 1000;
  
    var diffDays = Math.round(Math.abs((startDate - currentDate) / oneDay));
    return diffDays;
}

function authenticate(){
    firebase.auth().signInAnonymously()
    .then(() => {
      loadArchive();
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
  }
  
authenticate();


