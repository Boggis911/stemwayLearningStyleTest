const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const SES = new AWS.SES();

const senderEmail = process.env.SENDER_EMAIL;


exports.handler = async (event) => {
    // Parse the request body
    const body = JSON.parse(event.body);
    const requestType = body.requestType;
    const sessionUUID = body.sessionUUID;
    console.log("EVENT INFO: ", event);
    
    const clientIpAddress = event.requestContext.http.sourceIp;
    const currentTime = Date.now();
    
    console.log(`User ${clientIpAddress} completed stage ${requestType}`); //do not modify this one since it is in Cloudwatch




if (requestType === 'typeX') {
    // Fetch the questions from the learningStrategiesTestQuestionsTable
    let questions =[];
        try {
        // Fetch the questions from the learningStrategiesTestQuestionsTable
        const scanParams = {
            TableName: process.env.QUESTIONS,
            FilterExpression: 'testName = :testNameValue',
            ExpressionAttributeValues: {
                ':testNameValue': 'SOL'
            }
        };
        
        const scanResponse = await dynamoDB.scan(scanParams).promise();

        // Check if Items exist in the scan response
        if (scanResponse.Items && scanResponse.Items.length > 0) {
            questions = scanResponse.Items;
            
            // Sort the questions by 'question' key
            questions.sort((a, b) => a.number - b.number);
        } else {
            console.log("No items found for the given scan parameters.");
        }
    } catch (error) {
        console.error("An error occurred during the DynamoDB scan operation:", error);
        return {
            statusCode: 500,
            body: 'Failed to scan DynamoDB table'
        };
    }

    // Create a new array to hold the sorted question information
    const sortedQuestionInformation = questions.map((question) => {
        return question.question;
    });

    // Log the sorted question information
    sortedQuestionInformation.forEach((info, index) => {
        console.log(`Question ${index + 1}: ${info}`);
    });

    // Return the question information
    return {
        statusCode: 200,
        body: JSON.stringify(sortedQuestionInformation)
    };
}














else if (requestType === 'typeX') {
    // Extract the five values from the request body
    console.log("BODY", body);

    const userAnswers = body.answers;
    const language = body.language;



    // Validate the input
  if (userAnswers.some(answer => typeof answer !== 'number' || answer < 0 || answer > 5 || answer !== Math.floor(answer))) {
        return {
            statusCode: 400,
            body: 'Invalid input'
        };
    }
    
    
  if ((language != "en") && (language != "lt")) {
    return {
        statusCode: 400,
        body: 'Invalid input'
    };
}
    
    
let categories = [];
let categoryDescriptions = {};


    
    if (language == "en"){
    
        categories = [
            "Structured Learner",
            "Flexible Learner",
            "Collaborative Learner",
            "Digital Learner",
            "Curious Learner"
        ];
    
      
      
          // Dictionary of descriptions for each category
        categoryDescriptions = {
            "Structured Learner": "You thrive on organization and prefer a well-defined learning path. A systematic approach to studying suits you best.",
            "Flexible Learner": "You're adaptable and can adjust your learning methods based on the situation. You're open to exploring different ways to grasp a concept.",
            "Collaborative Learner": "You learn best when working with others. Group discussions and team projects are where you shine.",
            "Digital Learner": "You leverage technology and digital platforms to enhance your learning. Online resources and tools are your go-to.",
            "Curious Learner": "You dive deep into subjects, aiming for a profound understanding. You're not content with just the surface; you seek the underlying principles."
        };
    
    
    }

    
    if (language == "lt"){
        
        
        categories = [
        "Organizuotas Stilius",
        "Lankstus Stilius",
        "Komandinis Stilius",
        "Skaitmeninis Stilius",
        "Smalsumo Stilius"
      ];
        
        
        
        categoryDescriptions = {
        "Organizuotas Stilius": "Jums patinka organizuotas, tvarkingas darbas ir pirmenybė teikiama aiškiai apibrėžtam mokymosi keliui. Sistemingas mokymosi požiūris jums labiausiai tinka.",
        "Lankstus Stilius": "Jūs esate lankstus ir galite prisitaikyti prie situacijos, keisdami mokymosi metodus. Jums patinka mąstyti lanksčiai ir tyrinėti įvairias koncepcijas.",
        "Komandinis Stilius": "Jūs geriausiai mokotės dirbdami su kitais. Grupinės diskusijos ir komandiniai projektai yra jūsų stiprioji pusė.",
        "Skaitmeninis Stilius": "Jūs pasitelkiate technologijas ir skaitmenines platformas, kad pagilintumėte savo žinias ir surastumėte reikiamą informaciją. Įvairių internetinių resursų efektyvus naudojimas yra jūsų stiprioji pusė.",
        "Smalsumo Stilius": "Jūs gilinatės į temas, siekdami gilaus supratimo. Jums nepakanka tik paviršutiniškai žinoti; jūs ieškote pagrindinių principų. Vieną kartą pilnai supratę temą turbūt ilgai jos nepamirštate."
    };
    
        
    }   
  
  
  
    // Mapping answers to categories
const answerMap = {
    0: { 
        0: 0, // Structured Learner
        1: 1, // Flexible Learner
        2: 3  // Digital Learner
    },
    1: {
        0: 2, // Collaborative Learner
        1: 4, // Curious Learner
        2: 0  // Structured Learner
    },
    2: {
        0: 0, // Structured Learner
        1: 3, // Digital Learner
        2: 2  // Collaborative Learner
    },
    3: {
        0: 0, // Structured Learner
        1: 2, // Collaborative Learner
        2: 3  // Digital Learner
    },
    4: {
        0: 4, // Curious Learner
        1: 1, // Flexible Learner
        2: 2  // Collaborative Learner
    },
    5: {
        0: 3, // Digital Learner
        1: 0, // Structured Learner
        2: 2  // Collaborative Learner
    },
    6: {
        0: 4, // Curious Learner
        1: 2, // Collaborative Learner
        2: 3  // Digital Learner
    },
    7: {
        0: 1, // Flexible Learner
        1: 0, // Structured Learner
        2: 3  // Digital Learner
    },
    8: {
        0: 2, // Collaborative Learner
        1: 3, // Digital Learner
        2: 0  // Structured Learner
    },
    9: {
        0: 4, // Curious Learner
        1: 1, // Flexible Learner
        2: 0  // Structured Learner
    }
};




    // Initialize a score array with zeros
    let scores = [0, 0, 0, 0, 0];

    // Create an array to keep track of the total possible questions for each category
    let totalQuestionsForCategory = [0, 0, 0, 0, 0];

    // Determine the total possible questions for each category
    Object.values(answerMap).forEach(question => {
        Object.values(question).forEach(category => {
            totalQuestionsForCategory[category]++;
        });
    });

    // Iterate over user answers and update the scores
    userAnswers.forEach((answer, questionIndex) => {
        let category = answerMap[questionIndex][answer];
        scores[category]++;
    });


  

    
    // Find the category with the highest fraction
    let fractions = scores.map((score, index) => score / totalQuestionsForCategory[index]);
    console.log("These are fractions", fractions);
    let maxFraction = Math.max(...fractions);
    let maxCategoryIndex = fractions.indexOf(maxFraction);
    console.log("maxFraction and maxCategoryIndex", maxFraction, "HERE IS ANOTHER VARIABLE", maxCategoryIndex);
    
    let resultCategory = categories[maxCategoryIndex];
    let description = categoryDescriptions[resultCategory];
    

    console.log("this is what frontend receives", JSON.parse(JSON.stringify({
        resultCategory: resultCategory,
            resultDescription: description
    })))
    
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            resultCategory: resultCategory,
            resultDescription: description
        })
    };

    
};









   
if (requestType === 'typeX') {
  
    const language = body.language;
    const resultCategory = body.data.resultCategory;
    const userEmail = body.data.email;
    const userName = body.data.name;
    
    
      if ((language != "en") && (language != "lt")) {
        return {
            statusCode: 400,
            body: 'Invalid input'
        };
    }
    
    
    
    let selectedCategory = ""; 
    let emailIntroduction = ""; 
    let emailOutro1 = "";
    let emailOutro2 = "";
    let emailOutro3 = "";
    let testResults = "";
    
    
    
    
    
    
    if (language == "en"){
    
        const categoryDescriptionsAndTips = {
        "Structured Learner": {
            description: "As a Structured Learner, you have an innate preference for organization and clarity in your learning journey. You find solace in step-by-step processes, checklists, and predetermined pathways. This methodical approach allows you to build on existing knowledge systematically, ensuring that each new piece of information has a clear place in your mental framework. This style of learning is particularly beneficial when tackling complex subjects that require a linear understanding or when preparing for exams and tests. However, it's essential to remain open to occasional deviations, ensuring you don't miss out on spontaneous learning opportunities.",
            tip: "Consider using tools like planners, calendars, or task management apps to schedule your study sessions. Breaking topics into smaller chunks and tackling them one at a time can also enhance your structured learning approach."
        },
        "Flexible Learner": {
            description: "Your learning style is characterized by adaptability and fluidity. As a Flexible Learner, you're not bound by rigid structures or set routines. Instead, you navigate your learning journey with an open mind, adjusting your methods and strategies based on the topic, environment, and your mood. This adaptability can be a significant asset, especially in dynamic fields that require learners to stay updated with rapidly evolving information. While this flexibility can be a strength, ensuring some level of consistency can help in reinforcing your learning.",
            tip: "Stay curious and expose yourself to various learning resources. From podcasts to webinars, diversifying your resources can offer multiple perspectives and deepen your understanding."
        },
        "Collaborative Learner": {
            description: "Collaboration is at the heart of your learning style. As a Collaborative Learner, you find immense value in sharing ideas, discussing concepts, and learning through interaction. Group discussions, study teams, and project collaborations are platforms where you thrive. This interactive approach not only helps you understand different perspectives but also reinforces your knowledge. Being a team player, you often act as a glue in group settings, ensuring everyone's voice is heard. It's essential, however, to also dedicate time for individual reflection to solidify your understanding.",
            tip: "Join study groups or online forums related to your topics of interest. Engaging in debates or teaching others can also solidify your knowledge and offer new insights."
        },
        "Digital Learner": {
            description: "In the age of technology, you have embraced digital platforms as your primary learning tools. As a Digital Learner, online courses, e-books, educational apps, and virtual simulations are your go-to resources. You appreciate the convenience, vastness, and immediacy of digital information. This inclination allows you to stay updated with the latest information, learn at your own pace, and access resources from around the world. While digital tools offer numerous advantages, it's crucial to balance screen time with offline activities and ensure that digital consumption doesn't lead to information overload",
            tip: "Stay updated with the latest e-learning platforms and tools. Also, practice digital hygiene by organizing your online resources and taking regular breaks to reduce screen fatigue."
        },
        "Curious Learner": {
            description: "Depth over breadth defines your learning approach. As an Curious Learner, you're not content with surface-level understanding. Instead, you delve deep into subjects, seeking the underlying principles, connections, and nuances. This profound approach ensures that you grasp concepts at their core, allowing you to apply them innovatively in various contexts. While this depth provides a strong foundational understanding, it's also essential to occasionally zoom out, ensuring you see the bigger picture and understand how individual insights fit into broader contexts.",
            tip: "Engage in critical thinking exercises and challenge your own understanding. Keeping a journal to reflect on what you've learned can also help in deepening your insights."
        }
      };


selectedCategory = categoryDescriptionsAndTips[resultCategory];
console.log("Result Category: ", resultCategory);
console.log("Selected Category: ", categoryDescriptionsAndTips[resultCategory]);


emailIntroduction = `Hi ${userName},️ 🖐 \n\n I hope this finds you well! Firstly, congratulations 🎉 on completing our learning style evaluation. At Stemway, we believe that understanding your unique learning preferences is the first step towards unlocking your full academic potential. And guess what? By taking the initiative to complete our test, you've just earned a 60-minute free STEMWAY tutoring session! 📚`
emailOutro1 = "With the insights gained from your test results, we're able to match you with a tutor whose teaching style aligns with your learning preferences. This ensures a more effective and personalized learning experience tailored just for you. ✅"
emailOutro2 = "So, what's next? It's simple! Let us know the subject and grade level you'd like support in by simply replying to this email. Once we have that, we'll introduce you to a dedicated Stemway tutor. From there, you can coordinate with them directly and use your free 60min lesson time. Remember, you can choose to have multiple short sessions until you've used the full 60 minutes. It's all about what works best for you."
emailOutro3 = "Take advantage of this opportunity, meet our expert tutors, and discover a new dimension to learning. If you have any questions or need assistance at any step, our Stemway team is always here to help. 🤝 \n\nWishing you all the best in your learning journey. \n\n Warm regards, \n Augustinas \n Stemway Team 🌐";
testResults = "🚀 Learning Style: " + resultCategory + " \n\n" + 
              selectedCategory.description + "\n\n" +
              "💡 Tips: " + selectedCategory.tip + " ";




    }
    
    
    if (language == "lt"){
        
        

        
        
const categoryDescriptionsAndTips = {
    "Organizuotas Stilius": {
        description: "Jums būdinga sisteminga mokymosi eiga: mėgstate tvarką, aiškias taisykles ir nuoseklią struktūrą. Mėgstate sekti nusistatytus žingsnius, remtis sąrašais ir iš anksto apgalvotomis strategijomis. Šis mokymosi būdas ypač vertingas, kai reikia kruopščiai atlikti kokias nors užduotis ar tinkamai pasiruošti svarbiam egzaminui.",
        tip: "Naudokitės darbų sąrašais ir kalendoriais, kad optimizuotumėte savo mokymosi procesą. Dėl jūsų sistemingo požiūrio, jums tikrai verta praeitas temas pasikartoti ilgėjančiais intervalais (ang.: spaced repetition). Tai ne tik leis efektyviau užpildyti savo darbo kalendorių, bet ir užtvirtinti buvusių pamokų medžiagą. Tačiau kartais pernelyg struktūrizuotas mokymosi stilius neleidžia greitai prisitaikyti prie staigiai kintančių aplinkybių. Be to, kartais per daug laiko skiriama planavimui ir dėl to lieka mažiau laiko pačiam darbui. Puikus būdas susitvarkyti su netikėtai iškilusiais iššūkiais ar besikeičiančiomis aplinkybėmis yra palikti keletą laisvų vietų darbo kalendoriuje, kurias vėliau galėsite užpildyti pagal situaciją."
    },
    "Lankstus Stilius": {
        description: "Griežtos taisyklės ar tvarkaraščiai jums nėra būtini. Tokiam stiliui būdinga gebėjimas greitai keisti mokymosi strategijas ir metodus, priklausomai nuo situacijos. Galite lengvai perjungti dėmesį tarp skirtingų užduočių, o jūsų problemų sprendimas yra daugiau intuityvus, nei sistemingas. Jums dažnai būna lengviau mokytis, kai galite tai daryti savo tempu, o ne laikytis griežto plano ar tvarkaraščio. Tai suteikia jums galimybę geriau susidoroti su netikėtumais ir iššūkiais, kurių visada atsiranda mokymosi procese.",
        tip: "Plėskite savo mokymosi šaltinių paletę, pradedant nuo podcastų ir baigiant internetinėmis paskaitomis ar nemokamais resursais. Internete rasite daugybę vertingų resursų, kurie gali jums padėti (pvz. Khan Academy). Tačiau lankstus mokymosi stilius kartais gali privesti prie to, kad per daug laiko skiriate spontaniškumui ir nepakankamai svarbioms užduotims. Dėl to gali būti sunkiau užduotis atlikti laiku, o tai dažnai priveda prie praleistų terminų ir neatliktų užduočių kaupimosi. Dėl to šio stiliaus atstovams patariame naudoti Pomodoro metoda: naudokite laikmatį ir dirbkite intensyviai 25 minutės, tada pasidarykite 5 minutų pertrauką, kai reikia atlikti svarbias užduotis."
    },
    "Komandinis Stilius": {
        description: "Jums artimiausias mokymasis per bendravimą. Diskusijos, idėjų mainai ir kolektyvinis darbas – tai jūsų arena. Komandiniam stiliui būdingas noras dalintis idėjomis, diskutuoti ir analizuoti informaciją kartu su kitais. Jūs mėgstate iššūkius, kurie reikalauja bendro sprendimo ir tarpusavio pagalbos.",
        tip: "Prisijunkite prie mokymosi grupių ar forumų, kur galite dalintis žiniomis ir gauti naujų įžvalgų. Bendradarbiaujant su kitais, galima gauti daug vertingos informacijos ir išgirsti įvairias perspektyvas. Tačiau komandinis stilius kartais gali privesti prie to, kad per daug pasitikite kitais ir per mažai koncentruojatės į savarankišką darbą. Taip pat gali kilti pavojus, kad grupės dinamika gali trukdyti efektyviam darbui, ypač jei komandoje yra konfliktų ar nesutarimų. Norėdami išvengti šių pavojų, stenkitės išlaikyti balansą tarp komandinio darbo ir savarankiškumo. Taip pat būkite atidūs komandos dinamikai ir stenkitės konstruktyviai spręsti bet kokius nesutarimus ar konfliktus."
    },
    "Skaitmeninis Stilius": {
        description: "Jūsų mokymosi kelias yra glaudžiai susijęs su technologijomis. Internetiniai kursai, nemokami resursai, e-knygos ir edukacinės programėlės yra jūsų draugai. Jums patinka patogumas ir greitis, kurį suteikia skaitmeninės priemonės.",
        tip: "Ieškokite naujausių e. mokymosi platformų ir išteklių, taip pat besimokydami stenkitės reguliariai daryti pertraukas. Išbandykite programėles, kurios padeda pasidaryti užrašus ir pasikartoti įvairias temas. Tačiau tokio mokymosi stiliaus atstovai dažnai turi daug dėmesio trikdžių dėl gaunamų žinučių ir pranešimų. Taip pat labai lengva nepastebimai nuklysti nuo mokymosi trajektorijos. Geras būdas išvengti šių problemų yra nusistatyti 'do not disturb' režimą ar įsijungti tik pamokai reikalingą medžiagą. Taip pat išbandykite 20-20-20 taisyklę: kiekvienas 20 minučių, kurias praleidžiate prie ekrano, pažvelkite į objektą, esantį mažiausiai 20 metrų atstumu, 20 sekundžių."
    },
    "Smalsumo Stilius": {
        description: "Jums būdingas gilus temų supratimas. Siekiate pažinti kiekvieną temą nuo A iki Z, rasti sąryšius tarp skirtingų informacijos dalių. Jums svarbi ne vien informacija, bet ir jos išsamumas. Jūs dažnai naudojate sudėtingą temos analizę ir kritiškai mąstote apie tai, ką mokotės.",
        tip: "Kad maksimaliai išnaudotumėte įžvalgumo arba gilumo stiliaus privalumus, bandykite naudoti metodus, kurie padeda mąstyti kritiškai ir analitiškai. Pavyzdžiui, sukurkite sąvokų žemėlapius, kad vizualiai išdėstytumėte idėjas, arba naudokitės 'Socratic Method' diskusijomis, kuriose galite išsamiai ir kritiškai aptarti medžiagą. Tai padės jums išsamiai išnagrinėti svarbiausius temos aspektus ir ilgam juos įsiminti. Tačiau gilumo stiliui būdinga tendencija 'įstrigti' detalesnėse problemose arba pernelyg daug mąstyti apie sąlyginai paprastus dalykus ir prarasti bendrą vaizdą. Norėdami išvengti šių pavojų, stenkitės reguliariai grįžti prie bendro vaizdo ir nepamiršti, koks yra jūsų galutinis mokymosi tikslas. Tai padės jums išlaikyti tinkamą perspektyvą ir nesumažins mokymosi efektyvumo."
    }
};

    
    
    
    
selectedCategory = categoryDescriptionsAndTips[resultCategory];
emailIntroduction = `Sveiki ${userName}, 🖐️ \n\nIš pradžių norėtume jums padėkoti už tai, kad atlikote mūsų mokymosi stiliaus testą. Mes, Stemway komandoje, manome, kad suprasti savo unikalų mokymosi būdą yra svarbus žingsnis formuojant asmeninį mokymosi planą. Taip pat turime dar vieną smagią naujieną: kadangi jau atlikote mūsų mokymosi stiliaus testą, dovanojame jums 60 nemokamų mūsų individualios pamokos minučių! 📚`
emailOutro1 = "Remdamiesi jūsų testo rezultatais, galime jus sujungti su korepetitoriumi, kurio mokymosi būdai geriausiai atitinka jūsų mokymosi stilių. Tai garantuoja personalizuotą ir efektyvesnę mokymosi patirtį, pritaikytą būtent jums. ✅"
emailOutro2 = "Taigi, kas toliau? Viskas labai paprasta! Praneškite mums apie dalyką, kuriame jums reikėtų pagalbos (matematika arba fizika) ir savo klasę, tiesiog atsakydami į šį el. laišką. Gavę šią informaciją, supažindinsime jus su išrinktu Stemway korepetitoriumi. Po to galėsite tiesiogiai su juo susisiekti ir planuoti savo pamokas. Neužmirškite, kad galite pasirinkti keletą trumpesnių sesijų, kol išnaudosite visas 60 minučių. Viskas priklauso nuo jūsų poreikių ir pageidavimų." 
emailOutro3 = "Pasinaudokite šia unikalia proga ir susipažinkite su mūsų patyrusiais korepetitoriais. Jei kiltų klausimų ar reikėtų pagalbos, mūsų Stemway komanda visada čia, kad jums padėtų. 🤝  \n Linkiu jums viso geriausio jūsų mokymosi kelionėje. \n\n Augustinas, \n  Stemway komanda 🌐";
testResults = "🚀 Mokymosi Stilius: " + resultCategory + " \n\n" + 
              selectedCategory.description + "\n\n" +
              "💡 Patarimai: " + selectedCategory.tip;

        
        
        
    }
    
    

    const emailSubject = "new Stemway user";
    const emailBody = "Send to: " + userEmail + "\n\n\n" +
    emailIntroduction + "\n\n" + 
    testResults + "\n\n" + 
    emailOutro1 + "\n\n" + 
    emailOutro2 + "\n\n"+
    emailOutro3;


        // Use AWS SES to send the email
    const emailParams = {
        Source: senderEmail,
        Destination: {
            ToAddresses: [process.env.STEMWAY_EMAIL]
        },
        Message: {
            Subject: {
                Data: emailSubject
            },
            Body: {
                Text: {
                    Data: emailBody
                }
            }
        }
    };
    
    try {
        await SES.sendEmail(emailParams).promise();
        
        console.log("SENT EMAIL BODY", emailBody);
    
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Email sent successfully'
            })
        };
    } catch (error) {
        console.error("Error sending the email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error sending the email'
            })
        };
    }




}else {
    // Handle invalid requestType
    return {
        statusCode: 400,
        body: 'Invalid requestType'
    };
}
};
