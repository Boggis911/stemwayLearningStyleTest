      
            
    /* global localStorage */
document.addEventListener("DOMContentLoaded", function() {
 
    // Load modular parts of the page
    $("#header").load("../header.html");
    $("#contactForm").load("../contactForm.html");
    $("#footer").load("../footer.html");
    $("#cookieBanner").load("../cookieBanner.html");

});




  
// Check if a UUID already exists in the session storage
let sessionUUID = sessionStorage.getItem('sessionUUID');

// If there's no UUID in the session storage, generate a new one
if (!sessionUUID) {
    sessionUUID = uuidv4();
    sessionStorage.setItem('sessionUUID', sessionUUID);
}



var questions = [
    "When you're faced with a new topic, how do you approach it?",
    "You're struggling to understand a concept. What's your first instinct?",
    "Which of these environments makes you feel the most comfortable for studying?",
    "When working on a project, you...",
    "What do you enjoy most about learning?",
    "How do you typically take notes during a class or lecture?",
    "When you have a free evening, you're most likely to...",
    "How do you react to sudden changes in your study plan or curriculum?",
    "What's your preferred method for revising a topic?",
    "Which statement best describes your learning style?"
];

var answerChoices = [
    ["I create a structured plan with milestones.", "I start by exploring various resources and adjust my approach based on what I find.", "I look for online videos or digital tools that can provide a visual or interactive explanation."],
    ["Join a study group or ask a friend to discuss it.", "Dive deeper into the topic, looking for more detailed resources.", "Break the concept down into steps and tackle each systematically."],
    ["A quiet library with all my notes and textbooks.", "A digital platform with interactive exercises and quizzes.", "A group study session with peers."],
    ["Prefer clear instructions and guidelines.", "Enjoy brainstorming sessions with others for diverse perspectives.", "Use online tools and apps to aid in research and execution."],
    ["Discovering the deeper meanings and connections between ideas.", "The ability to adapt and apply knowledge in different contexts.", "Collaborating and sharing insights with others."],
    ["Digitally, using a laptop or tablet.", "By hand, in an organized notebook with sections and highlighted points.", "I often discuss and compare notes with classmates after the lecture."],
    ["Dive into a topic you're passionate about, even if it's not related to your current studies.", "Join a group activity or workshop.", "Explore new digital tools or apps that can aid your learning."],
    ["I quickly adapt and find new ways to tackle the material.", "I reorganize my study schedule to accommodate the change.", "I look for online resources to help me get up to speed."],
    ["Discussing key points with peers and clarifying doubts.", "Using digital flashcards and online quizzes.", "Going through my organized notes and systematically reviewing each section."],
    ["I want to understand the 'why' behind everything.", "I easily adapt to different learning environments.", "Clear guidelines help me achieve the best results."]
];



let answers = [];

let currentQuestion = 0;
let exitAttemtpts = 0;
let resultCategory= "";
const language = "en";





// document.addEventListener("DOMContentLoaded", function() {
//     fetchQuestions();
// });

// At the start, the introContainer should be visible
document.getElementById("introContainer").style.display = "block";
document.getElementById("introContainer").style.opacity = "1";

// The questionContainer should be hidden initially
document.getElementById("questionContainer").style.display = "none";
document.getElementById("questionContainer").style.opacity = "0";

document.getElementById("beginButton").style.opacity = "1";




document.getElementById("beginButton").addEventListener("click", function() {
    // Start the fade out of introContainer
    document.getElementById("introContainer").style.display = "none";
    
    updateQuestion();
    // After the fade out completes, hide the introContainer and show the questionContainer
    setTimeout(function() {
        
        document.getElementById("questionContainer").style.display = "block";
        document.getElementById("questionContainer").style.opacity = "1";
    }, 500); // 500ms matches the transition duration in your CSS
    
});


document.getElementById("backButton").addEventListener("click", function() {
    if (currentQuestion > 0) {
        // Store the current answer and go to the previous question
        let selectedRadio = document.querySelector('#answerOptions input[name="answerOption"]:checked');
        if (selectedRadio) {
            answers[currentQuestion] = parseInt(selectedRadio.value);
        }     
        currentQuestion--;
        updateQuestion();
    }
});



document.getElementById("nextButton").addEventListener("click", function() {
    let selectedRadio = document.querySelector('#answerOptions input[name="answerOption"]:checked');
    
    // Check if a radio option is selected
    if (!selectedRadio) {
        alert("Please select an answer before proceeding.");
        return; // Exit the function without doing anything else
    }

    // Store the current answer
    answers[currentQuestion] = parseInt(selectedRadio.value);

    // Check if the current question is not the last question
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        console.log("nextButton clicked");
        updateQuestion();
    }
});




document.getElementById("submitButton").addEventListener("click", function() {
    let selectedRadio = document.querySelector('#answerOptions input[name="answerOption"]:checked');
    
    // Check if a radio option is selected
    if (!selectedRadio) {
        alert("Please select an answer before submitting.");
        return; // Exit the function without doing anything else
    }

    // Store the current answer
    answers[currentQuestion] = parseInt(selectedRadio.value);

    // Hide the question container and display the results container
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("resultsContainer").style.display = "block";

    submitAnswers();
});









document.getElementById("resultsExitButton").addEventListener("click", function(){
    if (exitAttemtpts == 0){
        document.getElementById("callToActionText").innerText = "Are you sure? It is free anyways";
        exitAttemtpts++;
        
    }
    else if (exitAttemtpts > 0) {
        window.location.href = "../home/";
    }
    
});



document.getElementById("callToActionButton").addEventListener("click", function(){
    
    document.getElementById("resultsContainer").style.display = "none";
    
    document.getElementById("emailContainer").style.display = "block";
    document.getElementById("emailContainer").style.opacity = "1";
});


document.getElementById("submitEmail").addEventListener("click", function() {
    if (document.getElementById("privacyConsent").checked) {
        var userName = document.getElementById("userName").value;
        var userEmail = document.getElementById("userEmail").value;

        
        sendEmail(userName, userEmail);
        
    } else {
        alert("Please agree to our Privacy Policy before submitting your data.");
    }
});


document.getElementById("exitButton").addEventListener("click", function() {
    window.location.href = "../home/";
})












function updateQuestion() {
    console.log("updateQuestion function called");
    // Hide the question container
    document.getElementById("questionContainer").style.opacity = 0;
    document.getElementById("questionContainer").style.display = "block";

    // After a delay, update the question and answer display and show the question container
    setTimeout(function() {
        // Update the question text
        document.getElementById("question").innerText = questions[currentQuestion];
        let displayQuestionNumber = currentQuestion + 1;
        document.getElementById("questionNumber").innerText = "Question: " + displayQuestionNumber + "/" + questions.length;

        // Display the answer options
        let optionsDiv = document.getElementById("answerOptions");
        optionsDiv.innerHTML = ''; // Clear previous options
        
        
        
        
        answerChoices[currentQuestion].forEach((option, index) => {
            // Create the radio button
            let radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = 'answerOption';
            radioButton.value = index;
        
            // Check if this option was previously selected
            if (answers[currentQuestion] == index) {
                radioButton.checked = true;
            }
        
            // Create the text node for the answer choice
            let answerTextNode = document.createTextNode(option);
        
            // Append the radio button, answer text, and a line break to optionsDiv
            optionsDiv.appendChild(radioButton);
            optionsDiv.appendChild(answerTextNode);
            optionsDiv.appendChild(document.createElement('br'));
        });
        
        


        // Show or hide the back button depending on the current question
        document.getElementById("backButton").style.display = currentQuestion === 0 ? "none" : "inline-block";

        // Show or hide the next button depending on the current question
        document.getElementById("nextButton").style.display = currentQuestion === questions.length - 1 ? "none" : "inline-block";

        // Show or hide the submit button depending on the current question
        document.getElementById("submitButton").style.display = currentQuestion === questions.length - 1 ? "inline-block" : "none";

        // Show the question container
        document.getElementById("questionContainer").style.opacity = 1;
    }, 500);
}





function submitAnswers() {
    
    document.getElementById("loader").style.display = "block";

    // Send a POST request to the backend to evaluate the answers.
    fetch(MY_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestType: "typeX", answers: answers, sessionUUID: sessionUUID, language: language })
    })
    .then(response => {
        
        document.getElementById("results").innerText = "";
        document.getElementById("loader").style.display = "none";
        // Check if the request was successful
        
        if (!response.ok) {
            let resultsComment = document.getElementById("resultsComment");
            resultsComment.style.display = "block";
            resultsComment.innerText = "There was an error when calculating results. Try again later";
            
            throw new Error("Network response was not ok");
            
        }
        
        return response.json(); // Parse the response body as JSON
        
    })
    .then(data => {


    // Calculate the result score
        let description = data.resultDescription;
        resultCategory = data.resultCategory;
    
       
        // Display the comment
        document.getElementById("results").innerText = "After looking at your results we can conclude that you are most likely a " + resultCategory;

        let resultsComment = document.getElementById("resultsComment");
        resultsComment.style.display = "block";
        resultsComment.innerText = description;
        //display Call to Action
        
        
        setTimeout(function() {
    
        let callToActionText = document.getElementById("callToActionText");
        callToActionText.style.display = "block";
        callToActionText.innerText = "Congratulations! Now you can claim your free 60min lesson at STEMWAY and download your full test results";
        
        document.getElementById("resultsExitButton").style.opacity = 1;

        document.getElementById("callToActionButton").style.opacity = 1;

    
    
        }, 3000);



    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error submitting answers:', error);
    });
}










function sendEmail(userName, userEmail) {
    let data = {name: userName, email: userEmail, resultCategory: resultCategory};
    
    document.getElementById("emailContainer").style.display = "none";
    
    
    fetch(MY_API,{
    method: "Post",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({requestType: "typeX", data:data, sessionUUID: sessionUUID, language: language})
    
    })
    
    .then(response => {
            // Check if the request was successful
            document.getElementById("exitContainer").style.display = "block";
            document.getElementById("exitContainer").style.opacity = 1;
            
            if (response.ok) {
                document.getElementById("exitContainerText").innerText = "Success! Your email will be delivered within 1-2 business days"
                
                
                
            } else{
                document.getElementById("exitContainerText").innerText = "There was an error while processing your details. Try again later"
                throw new Error("Network response was not ok");
            }
            
        })

    
}
