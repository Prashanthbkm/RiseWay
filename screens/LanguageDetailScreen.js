import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Button, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';

const quizData = {
  JavaScript: [
    { question: "Who created JavaScript?", options: ["Brendan Eich", "James Gosling", "Bjarne Stroustrup", "Rasmus Lerdorf"], answer: "Brendan Eich" },
    { question: "Which company originally developed JavaScript?", options: ["Microsoft", "Netscape", "Google", "Sun Microsystems"], answer: "Netscape" },
    { question: "What was JavaScript originally called?", options: ["Mocha", "LiveScript", "WebScript", "Both Mocha and LiveScript"], answer: "Both Mocha and LiveScript" },
    { question: "Which built-in method returns the character at the specified index?", options: ["characterAt()", "getCharAt()", "charAt()", "None of the above"], answer: "charAt()" },
    { question: "Which symbol is used for comments in JavaScript?", options: ["//", "<!--", "/*", "#"], answer: "//" }
  ],
  Python: [
    { question: "Who created Python?", options: ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Dennis Ritchie"], answer: "Guido van Rossum" },
    { question: "What year was Python first released?", options: ["1991", "1995", "1989", "2000"], answer: "1991" },
    { question: "Which of these is NOT a Python framework?", options: ["Django", "Flask", "Spring", "FastAPI"], answer: "Spring" },
    { question: "How do you create a comment in Python?", options: ["//", "#", "/* */", "--"], answer: "#" },
    { question: "Which company uses Python extensively?", options: ["Google", "Microsoft", "Apple", "All of the above"], answer: "All of the above" }
  ],
  Java: [
    { question: "Who created Java?", options: ["James Gosling", "Bjarne Stroustrup", "Guido van Rossum", "Brendan Eich"], answer: "James Gosling" },
    { question: "What was Java originally called?", options: ["Oak", "Green", "C++--", "WebLanguage"], answer: "Oak" },
    { question: "Which company developed Java?", options: ["Sun Microsystems", "Microsoft", "IBM", "Oracle"], answer: "Sun Microsystems" },
    { question: "What is the extension of Java bytecode files?", options: [".java", ".class", ".byte", ".javac"], answer: ".class" },
    { question: "Which keyword is used to define a constant in Java?", options: ["const", "final", "static", "constant"], answer: "final" }
  ],
  C: [
    { question: "Who created the C language?", options: ["Dennis Ritchie", "Ken Thompson", "Bjarne Stroustrup", "Brian Kernighan"], answer: "Dennis Ritchie" },
    { question: "In which decade was C developed?", options: ["1960s", "1970s", "1980s", "1990s"], answer: "1970s" },
    { question: "Which operating system was rewritten in C?", options: ["UNIX", "Windows", "Linux", "DOS"], answer: "UNIX" },
    { question: "What is the standard C library?", options: ["glibc", "stdlib", "Both glibc and stdlib", "None"], answer: "Both glibc and stdlib" },
    { question: "Which company developed C?", options: ["Bell Labs", "Microsoft", "IBM", "AT&T"], answer: "Bell Labs" }
  ],
  'C++': [
    { question: "Who created C++?", options: ["Bjarne Stroustrup", "Dennis Ritchie", "James Gosling", "Guido van Rossum"], answer: "Bjarne Stroustrup" },
    { question: "What was C++ originally called?", options: ["C with Classes", "Better C", "C Plus", "Object C"], answer: "C with Classes" },
    { question: "Which concept is NOT in C++?", options: ["Inheritance", "Polymorphism", "Garbage Collection", "Templates"], answer: "Garbage Collection" },
    { question: "Which operator is used for dynamic memory allocation?", options: ["malloc", "new", "alloc", "create"], answer: "new" },
    { question: "What does STL stand for?", options: ["Standard Template Library", "Simple Template Library", "System Template Library", "Standard Type Library"], answer: "Standard Template Library" }
  ],
  'C#': [
    { question: "Who created C#?", options: ["Anders Hejlsberg", "Scott Guthrie", "Satya Nadella", "Bill Gates"], answer: "Anders Hejlsberg" },
    { question: "Which company developed C#?", options: ["Microsoft", "Google", "Apple", "Oracle"], answer: "Microsoft" },
    { question: "What year was C# first released?", options: ["2000", "2002", "1998", "2005"], answer: "2000" },
    { question: "Which framework is C# primarily used with?", options: [".NET", "Spring", "Django", "Ruby on Rails"], answer: ".NET" },
    { question: "What was C# originally called?", options: ["Cool", "C Sharp", "C Plus", "Microsoft Java"], answer: "Cool" }
  ],
  PHP: [
    { question: "Who created PHP?", options: ["Rasmus Lerdorf", "Brendan Eich", "James Gosling", "Guido van Rossum"], answer: "Rasmus Lerdorf" },
    { question: "What does PHP stand for?", options: ["PHP: Hypertext Preprocessor", "Personal Home Page", "Both of the above", "None of the above"], answer: "Both of the above" },
    { question: "Which symbol starts a variable in PHP?", options: ["$", "@", "#", "&"], answer: "$" },
    { question: "What year was PHP created?", options: ["1994", "1995", "1998", "2000"], answer: "1994" },
    { question: "Which company originally used PHP for Facebook?", options: ["Facebook", "Google", "Yahoo", "Microsoft"], answer: "Facebook" }
  ],
  Swift: [
    { question: "Who created Swift?", options: ["Chris Lattner and Apple", "Steve Jobs", "Tim Cook", "Guido van Rossum"], answer: "Chris Lattner and Apple" },
    { question: "What year was Swift announced?", options: ["2014", "2012", "2015", "2016"], answer: "2014" },
    { question: "What is Swift primarily used for?", options: ["iOS/macOS development", "Web development", "Game development", "Data science"], answer: "iOS/macOS development" },
    { question: "Which language did Swift replace for Apple development?", options: ["Objective-C", "C++", "Java", "Python"], answer: "Objective-C" },
    { question: "Is Swift open source?", options: ["Yes", "No", "Partially", "Only for education"], answer: "Yes" }
  ],
  Go: [
    { question: "Who created Go?", options: ["Robert Griesemer, Rob Pike, Ken Thompson", "Google Team", "Dennis Ritchie", "Bjarne Stroustrup"], answer: "Robert Griesemer, Rob Pike, Ken Thompson" },
    { question: "Which company developed Go?", options: ["Google", "Microsoft", "Facebook", "Apple"], answer: "Google" },
    { question: "What year was Go announced?", options: ["2009", "2007", "2011", "2012"], answer: "2009" },
    { question: "What is another name for Go?", options: ["Golang", "Google Language", "System Go", "Go Programming"], answer: "Golang" },
    { question: "Which tool is written in Go?", options: ["Docker", "React", "Angular", "Django"], answer: "Docker" }
  ],
  Rust: [
    { question: "Who created Rust?", options: ["Graydon Hoare", "Mozilla Team", "Google Developers", "Microsoft Research"], answer: "Graydon Hoare" },
    { question: "Which organization sponsored Rust's development?", options: ["Mozilla", "Google", "Microsoft", "Apple"], answer: "Mozilla" },
    { question: "What year was Rust first released?", options: ["2010", "2012", "2015", "2018"], answer: "2010" },
    { question: "What is Rust known for?", options: ["Memory safety", "Speed", "Concurrency", "All of the above"], answer: "All of the above" },
    { question: "Which browser increasingly uses Rust?", options: ["Firefox", "Chrome", "Safari", "Edge"], answer: "Firefox" }
  ]
};

const courseData = {
  JavaScript: {
    father: 'Brendan Eich',
    history: 'JavaScript was created by Brendan Eich in 1995 while working at Netscape. Initially designed to add interactivity to webpages, it has since evolved into a versatile language used for both frontend and backend development.',
    syntax: '// Log Hello World to console\nconsole.log("Hello World!");',
    frameworks: ['React', 'Vue', 'Angular', 'Node.js'],
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    rating: 9,
    funFacts: [
      'JavaScript and Java are unrelated languages.',
      'It is one of the most popular languages on GitHub.',
      'Node.js allows running JavaScript outside the browser.'
    ],
    sections: [
      {
        title: 'Introduction to JavaScript',
        desc: 'Learn the basics of JavaScript programming language and its role in web development.',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk'
      },
      {
        title: 'Variables and Data Types',
        desc: 'Understanding variables, data types, and how to store and manipulate data in JavaScript.',
        videoUrl: 'https://www.youtube.com/embed/9emXNzqCKyg'
      }
    ]
  },
  Python: {
    father: 'Guido van Rossum',
    history: 'Python was created by Guido van Rossum and first released in 1991. It was designed with an emphasis on code readability and a syntax that allows programmers to express concepts in fewer lines of code.',
    syntax: '# Print Hello World\nprint("Hello World!")',
    frameworks: ['Django', 'Flask', 'FastAPI', 'Pyramid'],
    docUrl: 'https://docs.python.org/3/',
    rating: 9,
    funFacts: [
      'Python was named after the British comedy group Monty Python.',
      'It is one of the most beginner-friendly programming languages.',
      'Python has a philosophy called "The Zen of Python".'
    ],
    sections: [
      {
        title: 'Python Basics',
        desc: 'Introduction to Python programming fundamentals and basic syntax.',
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc'
      },
      {
        title: 'Functions and Modules',
        desc: 'Learn how to create functions and work with modules in Python.',
        videoUrl: 'https://www.youtube.com/embed/daefaLgNkw0'
      }
    ]
  },
  Java: {
    father: 'James Gosling',
    history: 'Java was developed by James Gosling at Sun Microsystems and released in 1995. It was designed to have as few implementation dependencies as possible, with the motto "Write Once, Run Anywhere".',
    syntax: '// Print Hello World\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
    frameworks: ['Spring', 'Hibernate', 'Struts', 'JavaFX'],
    docUrl: 'https://docs.oracle.com/javase/',
    rating: 8,
    funFacts: [
      'Java was originally called Oak after an oak tree outside Gosling\'s office.',
      'It is one of the most widely used enterprise programming languages.',
      'Android apps are primarily written in Java.'
    ],
    sections: [
      {
        title: 'Java Fundamentals',
        desc: 'Learn the basics of Java programming and object-oriented concepts.',
        videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34'
      },
      {
        title: 'Object-Oriented Programming',
        desc: 'Understanding classes, objects, and OOP concepts in Java.',
        videoUrl: 'https://www.youtube.com/embed/BGTx91t8q50'
      }
    ]
  },
  C: {
    father: 'Dennis Ritchie',
    history: 'C was developed by Dennis Ritchie at Bell Labs between 1972 and 1973. It was created to overcome the limitations of previous languages like B and BCPL, and became the foundation for many modern programming languages.',
    syntax: '// Print Hello World\n#include <stdio.h>\n\nint main() {\n  printf("Hello World!\\n");\n  return 0;\n}',
    frameworks: ['Standard Library', 'POSIX', 'WinAPI'],
    docUrl: 'https://en.cppreference.com/w/c',
    rating: 7,
    funFacts: [
      'C is often called the "mother of all programming languages".',
      'The UNIX operating system was rewritten in C in 1973.',
      'Most modern programming languages have syntax influenced by C.'
    ],
    sections: [
      {
        title: 'C Programming Basics',
        desc: 'Introduction to C programming language and basic concepts.',
        videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0'
      },
      {
        title: 'Pointers and Memory Management',
        desc: 'Understanding pointers, memory allocation, and management in C.',
        videoUrl: 'https://www.youtube.com/embed/mw1qsMieK5c'
      }
    ]
  },
  'C++': {
    father: 'Bjarne Stroustrup',
    history: 'C++ was created by Bjarne Stroustrup at Bell Labs starting in 1979. It was designed as an extension of the C language with object-oriented programming features while maintaining compatibility with C.',
    syntax: '// Print Hello World\n#include <iostream>\n\nint main() {\n  std::cout << "Hello World!" << std::endl;\n  return 0;\n}',
    frameworks: ['STL', 'Boost', 'Qt', 'Unreal Engine'],
    docUrl: 'https://isocpp.org/',
    rating: 8,
    funFacts: [
      'C++ was originally called "C with Classes".',
      'It is widely used in game development and high-performance applications.',
      'Many operating systems are written in C and C++.'
    ],
    sections: [
      {
        title: 'C++ Fundamentals',
        desc: 'Learning the basics of C++ programming and syntax.',
        videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y'
      },
      {
        title: 'Object-Oriented C++',
        desc: 'Classes, objects, inheritance, and polymorphism in C++.',
        videoUrl: 'https://www.youtube.com/embed/wxznTygnRfQ'
      }
    ]
  },
  'C#': {
    father: 'Anders Hejlsberg',
    history: 'C# was developed by Anders Hejlsberg and his team at Microsoft around 2000. It was designed as a modern, object-oriented programming language for the .NET framework, combining elements from C++ and Java.',
    syntax: '// Print Hello World\nusing System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello World!");\n  }\n}',
    frameworks: ['.NET', 'ASP.NET', 'Xamarin', 'Unity'],
    docUrl: 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    rating: 8,
    funFacts: [
      'C# was originally called "Cool" (C-like Object Oriented Language).',
      'It is the primary language for Unity game development.',
      'C# was standardized by ECMA and ISO.'
    ],
    sections: [
      {
        title: 'C# Basics',
        desc: 'Introduction to C# programming language and .NET framework.',
        videoUrl: 'https://www.youtube.com/embed/gfkTfCPWqX0'
      },
      {
        title: '.NET Framework',
        desc: 'Understanding the .NET ecosystem and framework features.',
        videoUrl: 'https://www.youtube.com/embed/4l2qxSun2gU'
      }
    ]
  },
  PHP: {
    father: 'Rasmus Lerdorf',
    history: 'PHP was created by Rasmus Lerdorf in 1994. Originally standing for "Personal Home Page", it now stands for "PHP: Hypertext Preprocessor". It was designed for web development and can be embedded into HTML.',
    syntax: '// Print Hello World\n<?php\necho "Hello World!";\n?>',
    frameworks: ['Laravel', 'Symfony', 'CodeIgniter', 'CakePHP'],
    docUrl: 'https://www.php.net/docs.php',
    rating: 7,
    funFacts: [
      'PHP was not originally intended to be a programming language.',
      'It powers about 79% of all websites whose server-side programming language is known.',
      'Facebook was originally written in PHP.'
    ],
    sections: [
      {
        title: 'PHP Basics',
        desc: 'Introduction to server-side scripting with PHP.',
        videoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c'
      },
      {
        title: 'PHP and MySQL',
        desc: 'Database integration with PHP and MySQL.',
        videoUrl: 'https://www.youtube.com/embed/Yw7Lx9wqyJc'
      }
    ]
  },
  Swift: {
    father: 'Chris Lattner and Apple Inc.',
    history: 'Swift was developed by Chris Lattner and Apple Inc. and first released in 2014. It was designed to be a modern, safe, and fast programming language for iOS, macOS, watchOS, and tvOS development.',
    syntax: '// Print Hello World\nprint("Hello World!")',
    frameworks: ['SwiftUI', 'UIKit', 'Combine', 'Vapor'],
    docUrl: 'https://docs.swift.org/swift-book/',
    rating: 8,
    funFacts: [
      'Swift was designed to be easier to learn than Objective-C.',
      'It is open-source and available on Linux.',
      'Swift playgrounds provide an interactive way to learn the language.'
    ],
    sections: [
      {
        title: 'Swift Fundamentals',
        desc: 'Learning the basics of Swift programming.',
        videoUrl: 'https://www.youtube.com/embed/comQ1-x2a1Q'
      },
      {
        title: 'iOS Development with Swift',
        desc: 'Building mobile applications using Swift.',
        videoUrl: 'https://www.youtube.com/embed/aiXvvL1wNUc'
      }
    ]
  },
  Go: {
    father: 'Robert Griesemer, Rob Pike, and Ken Thompson',
    history: 'Go was developed at Google by Robert Griesemer, Rob Pike, and Ken Thompson in 2007. It was designed to address criticism of other languages used at Google while keeping their useful characteristics.',
    syntax: '// Print Hello World\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello World!");\n}',
    frameworks: ['Gin', 'Echo', 'Beego', 'Revel'],
    docUrl: 'https://golang.org/doc/',
    rating: 8,
    funFacts: [
      'Go is also known as Golang.',
      'It was designed for efficient compilation, execution, and ease of programming.',
      'Many popular tools like Docker and Kubernetes are written in Go.'
    ],
    sections: [
      {
        title: 'Go Basics',
        desc: 'Introduction to Go programming language.',
        videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU'
      },
      {
        title: 'Concurrency in Go',
        desc: 'Understanding goroutines and channels.',
        videoUrl: 'https://www.youtube.com/embed/LvgVSSpwND8'
      }
    ]
  },
  Rust: {
    father: 'Graydon Hoare',
    history: 'Rust was originally designed by Graydon Hoare at Mozilla Research and first released in 2010. It was created to be a language focusing on safety, speed, and concurrency while preventing segfaults and guaranteeing thread safety.',
    syntax: '// Print Hello World\nfn main() {\n  println!("Hello World!");\n}',
    frameworks: ['Actix', 'Rocket', 'Tokio', 'Yew'],
    docUrl: 'https://doc.rust-lang.org/book/',
    rating: 9,
    funFacts: [
      'Rust has been voted the "most loved programming language" in Stack Overflow surveys for several years.',
      'It guarantees memory safety without using a garbage collector.',
      'Mozilla Firefox is increasingly written in Rust.'
    ],
    sections: [
      {
        title: 'Rust Fundamentals',
        desc: 'Learning the basics of Rust programming.',
        videoUrl: 'https://www.youtube.com/embed/5C_HPTJg5ek'
      },
      {
        title: 'Ownership and Borrowing',
        desc: 'Understanding Rust\'s unique memory management system.',
        videoUrl: 'https://www.youtube.com/embed/8M0QfLUDaaA'
      }
    ]
  }
};

async function generateCertificate({ name, testTitle, score }) {
  const date = new Date().toLocaleDateString();
  const html = `
    <div style="text-align:center; padding:36px;">
      <h1>Certificate of Completion</h1>
      <p>This certifies that <b>${name}</b></p>
      <p>has successfully completed <b>${testTitle}</b></p>
      <h2>Score: ${score}</h2>
      <p>Date: ${date}</p>
      <div style='margin-top: 50px; font-size: 13px;'>Authorized Signature</div>
    </div>
  `;
  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  } catch (err) {
    Alert.alert('Error', 'Certificate generation failed.');
  }
}

export default function LanguageDetailScreen({ navigation, route }) {
  let languageParam = typeof route.params === "string"
    ? route.params
    : route.params.language || route.params.name || "";
  languageParam = languageParam.trim().toLowerCase();

  const matchedKey = Object.keys(courseData).find(
    key => key.trim().toLowerCase() === languageParam
  );
  const info = courseData[matchedKey];

  const [lastScore, setLastScore] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState(Array(15).fill(null));
  const [openSections, setOpenSections] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  
  const pulseAnim = useState(new Animated.Value(1))[0];
  const listenAnim = useState(new Animated.Value(1))[0];

  // Speech-to-Text Functions
  const startListening = async () => {
    if (!voiceEnabled) {
      speak("Please enable voice assistant first to use speech commands.");
      return;
    }

    try {
      setIsListening(true);
      setTranscript('');
      setShowVoiceInput(true);
      
      // Start listening animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(listenAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(listenAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate speech recognition
      setTimeout(() => {
        const commands = ['read overview', 'take quiz', 'read history', 'open documentation'];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        setTranscript(randomCommand);
        
        // Process the command
        if (randomCommand === 'read overview') {
          speakLanguageOverview();
        } else if (randomCommand === 'take quiz') {
          setShowQuiz(true);
          speak(`Starting ${matchedKey} quiz`);
        } else if (randomCommand === 'read history') {
          speak(info.history);
        } else if (randomCommand === 'open documentation') {
          speak(`Opening ${matchedKey} documentation`);
          setTimeout(() => Linking.openURL(info.docUrl), 1500);
        }
        
        // Auto-close after processing
        setTimeout(() => {
          setIsListening(false);
          setShowVoiceInput(false);
        }, 2000);
      }, 3000);

    } catch (error) {
      console.log('Speech recognition error:', error);
      setIsListening(false);
      setShowVoiceInput(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setShowVoiceInput(false);
    listenAnim.setValue(1);
  };

  // Voice Assistant Functions
  const speak = async (text, rate = 0.85) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        rate: rate,
        pitch: 0.8,
        volume: 0.9,
        language: 'en-US',
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.log('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const toggleVoiceAssistant = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    if (isListening) {
      stopListening();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const speakLanguageOverview = () => {
    if (!info) return;
    
    const overview = `${matchedKey} was created by ${info.father}. ${info.history}. Key frameworks include ${info.frameworks.join(', ')}.`;
    speak(overview);
  };

  const speakFunFacts = () => {
    if (!info) return;
    
    const facts = `Fun facts about ${matchedKey}: ${info.funFacts.join('. ')}`;
    speak(facts);
  };

  const speakSectionContent = (section) => {
    const content = `${section.title}. ${section.desc}`;
    speak(content);
  };

  const speakQuizQuestion = (question, index) => {
    const questionText = `Question ${index + 1}: ${question.question}. Options: ${question.options.join(', ')}`;
    speak(questionText, 0.8);
  };

  const speakQuizResults = (score) => {
    const resultText = `Quiz completed! You scored ${score} out of 15. ${score >= 12 ? 'Excellent work!' : score >= 8 ? 'Good job!' : 'Keep practicing!'}`;
    speak(resultText);
  };

  // Pulse animation for voice button
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  // Auto-speak language overview when screen loads
  useEffect(() => {
    if (info && voiceEnabled) {
      setTimeout(() => {
        speakLanguageOverview();
      }, 1000);
    }
  }, [info, voiceEnabled]);

  useEffect(() => {
    AsyncStorage.getItem(`quiz${matchedKey}`).then(val => {
      if (val) setLastScore(Number(val));
    });
  }, [matchedKey]);

  if (!info) {
    return (
      <View style={{padding: 32}}>
        <Text style={{fontSize: 18, color: 'red', textAlign: 'center'}}>
          No information found for this language.
        </Text>
      </View>
    );
  }

  const handleAnswer = (index, option) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
    
    // Speak the selected option
    if (voiceEnabled) {
      speak(`Selected: ${option}`);
    }
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      if (voiceEnabled) {
        speak("Please answer all questions before submitting.");
      }
      alert('Please answer all questions before submitting.');
      return;
    }
    let score = 0;
    answers.forEach((answer, idx) => {
      if (answer === quizData[matchedKey][idx].answer) score++;
    });
    
    if (voiceEnabled) {
      speakQuizResults(score);
      setTimeout(() => {
        alert(`You scored ${score} out of 15`);
      }, 3000);
    } else {
      alert(`You scored ${score} out of 15`);
    }
    
    setLastScore(score);
    setShowQuiz(false);
    AsyncStorage.setItem(`quiz${matchedKey}`, score.toString());
  };

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    
    // Speak section content when opened
    if (!openSections[idx] && voiceEnabled) {
      speakSectionContent(info.sections[idx]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f8fc' }}>
      {/* Voice Assistant Controls */}
      <View style={styles.voiceControls}>
        {/* Speech-to-Text Button */}
        <Animated.View 
          style={[
            styles.voiceInputButton,
            { 
              backgroundColor: isListening ? '#ffd43b' : '#74c0fc',
              transform: [{ scale: listenAnim }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={isListening ? stopListening : startListening}
            style={styles.voiceButtonInner}
            activeOpacity={0.8}
          >
            <Text style={styles.voiceButtonText}>
              {isListening ? '🎤' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Text-to-Speech Button */}
        <Animated.View 
          style={[
            styles.voiceButton,
            { 
              backgroundColor: voiceEnabled ? '#51cf66' : '#ff6b6b',
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={toggleVoiceAssistant}
            style={styles.voiceButtonInner}
            activeOpacity={0.8}
          >
            <Text style={styles.voiceButtonText}>
              {isSpeaking ? '🔊' : voiceEnabled ? '🔈' : '🔇'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {isSpeaking && (
          <TouchableOpacity
            onPress={stopSpeaking}
            style={styles.stopButton}
            activeOpacity={0.8}
          >
            <Text style={styles.stopButtonText}>⏹️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Voice Input Modal */}
      {showVoiceInput && (
        <View style={styles.voiceInputOverlay}>
          <View style={styles.voiceInputContainer}>
            <Animated.View 
              style={[
                styles.listeningAnimation,
                { transform: [{ scale: listenAnim }] }
              ]}
            >
              <Text style={styles.listeningText}>🎤</Text>
            </Animated.View>
            <Text style={styles.listeningTitle}>
              {isListening ? "Listening..." : "Processing..."}
            </Text>
            {transcript ? (
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            ) : (
              <Text style={styles.instructionText}>Speak now...</Text>
            )}
            <TouchableOpacity
              onPress={stopListening}
              style={styles.cancelListeningButton}
            >
              <Text style={styles.cancelListeningText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Language Header with Voice */}
        <View style={styles.languageHeader}>
          <Text style={styles.title}>{matchedKey}</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={speakLanguageOverview}
              style={styles.headerVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.voiceIcon}>🔊 Overview</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Creator with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>Creator</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={() => speak(`Created by ${info.father}`)}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.text}>{info.father}</Text>

        {/* History with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>History</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={() => speak(info.history)}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.text}>{info.history}</Text>

        {/* Frameworks with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>Popular Frameworks</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={() => speak(`Popular frameworks: ${info.frameworks.join(', ')}`)}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.frameworkRow}>
          {info.frameworks.map((fw) => (
            <TouchableOpacity
              key={fw}
              style={styles.frameworkChip}
              onPress={() => voiceEnabled && speak(fw)}
              activeOpacity={voiceEnabled ? 0.7 : 1}
            >
              <Text>{fw}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Syntax with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>Basic Syntax</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={() => speak(`Basic syntax example: ${info.syntax.replace(/\n/g, ' ')}`)}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.syntaxBox}>
          <Text style={styles.syntax}>{info.syntax}</Text>
        </View>

        {/* Documentation with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>Documentation</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={() => speak(`Official documentation available at ${info.docUrl}`)}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => {
            if (voiceEnabled) {
              speak(`Opening ${matchedKey} documentation in browser`);
              setTimeout(() => Linking.openURL(info.docUrl), 2000);
            } else {
              Linking.openURL(info.docUrl);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#1a78c2' }}>{info.docUrl}</Text>
        </TouchableOpacity>

        {/* Fun Facts with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>Fun Facts</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={speakFunFacts}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊 All</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.factsBox}>
          {info.funFacts.map((fact, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => voiceEnabled && speak(fact)}
              activeOpacity={voiceEnabled ? 0.7 : 1}
            >
              <Text style={styles.factsText}>• {fact}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Video Course Sections with Voice */}
        <View style={styles.sectionWithVoice}>
          <Text style={styles.heading}>Video Course Sections</Text>
          {voiceEnabled && (
            <TouchableOpacity
              onPress={() => speak(`There are ${info.sections.length} video sections available`)}
              style={styles.smallVoiceButton}
              activeOpacity={0.7}
            >
              <Text style={styles.smallVoiceIcon}>🔊</Text>
            </TouchableOpacity>
          )}
        </View>
        {info.sections.map((section, idx) => (
          <View key={idx} style={styles.sectionCard}>
            <TouchableOpacity 
              onPress={() => toggleSection(idx)}
              style={styles.sectionHeader}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.sectionTitle,
                openSections[idx] && { color: '#ef233c', textDecorationLine: 'underline' }
              ]}>
                {section.title}
              </Text>
              {voiceEnabled && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    speakSectionContent(section);
                  }}
                  style={styles.sectionVoiceButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.smallVoiceIcon}>🔊</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            {openSections[idx] && (
              <>
                <Text style={styles.sectionDesc}>{section.desc}</Text>
                <View style={{ height: 180, borderRadius: 8, overflow: 'hidden', marginBottom: 7 }}>
                  <WebView 
                    source={{ uri: section.videoUrl }} 
                    allowsInlineMediaPlayback 
                    mediaPlaybackRequiresUserAction={false} 
                  />
                </View>
              </>
            )}
          </View>
        ))}

        {/* Quiz Section with Enhanced Voice */}
        <TouchableOpacity
          style={[styles.fabBtn, { alignSelf: 'center', marginVertical: 20 }]}
          onPress={() => {
            setShowQuiz(!showQuiz);
            if (voiceEnabled && !showQuiz) {
              speak(`Starting ${matchedKey} quiz. There are 15 questions. Good luck!`);
            }
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.fabBtnText}>
            {showQuiz ? 'Hide Test' : 'Take Test'} {voiceEnabled && '🎤'}
          </Text>
        </TouchableOpacity>

        {showQuiz && (
          <>
            <Text style={styles.quizHeader}>
              {matchedKey} Quiz
              {voiceEnabled && (
                <TouchableOpacity
                  onPress={() => speak(`Starting ${matchedKey} quiz with ${quizData[matchedKey].length} questions`)}
                  style={styles.quizVoiceButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.voiceIcon}> 🔊 Start</Text>
                </TouchableOpacity>
              )}
            </Text>
            {quizData[matchedKey].map((q, i) => (
              <View key={i} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionText}>{i + 1}. {q.question}</Text>
                  {voiceEnabled && (
                    <TouchableOpacity
                      onPress={() => speakQuizQuestion(q, i)}
                      style={styles.questionVoiceButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.smallVoiceIcon}>🔊</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {q.options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleAnswer(i, option)}
                    style={[
                      styles.optionBtn,
                      answers[i] === option && styles.optionBtnActive
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.submitText}>
                Submit Answers {voiceEnabled && '🎯'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {lastScore !== null && (
          <View style={styles.certificateButtonWrap}>
            <Text style={styles.lastScoreText}>
              Last Score: {lastScore} / 15
            </Text>
            <Button
              title="Download Certificate"
              color="#00917c"
              onPress={() => {
                if (voiceEnabled) {
                  speak(`Generating certificate for ${lastScore} out of 15 score`);
                }
                generateCertificate({
                  name: 'Your Name',
                  testTitle: matchedKey,
                  score: lastScore
                });
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Voice Controls
  voiceControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceInputButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  voiceButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonText: {
    fontSize: 20,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stopButtonText: {
    fontSize: 16,
  },
  // Voice Input Overlay
  voiceInputOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  voiceInputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
  },
  listeningAnimation: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#74c0fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningText: {
    fontSize: 30,
  },
  listeningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transcriptText: {
    fontSize: 16,
    color: '#1a659e',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  cancelListeningButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
  },
  cancelListeningText: {
    color: 'white',
    fontWeight: '600',
  },
  // Language Header
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f2027',
    textAlign: 'center',
    flex: 1,
  },
  headerVoiceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  voiceIcon: {
    fontSize: 12,
    color: '#1565c0',
    fontWeight: '600',
  },
  // Sections with Voice
  sectionWithVoice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 4,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 21,
    color: '#29323c',
  },
  smallVoiceButton: {
    padding: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  smallVoiceIcon: {
    fontSize: 10,
    color: '#666',
  },
  text: {
    fontSize: 17,
    color: '#232536',
    marginTop: 5,
    marginBottom: 4,
    lineHeight: 24,
  },
  frameworkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 10,
  },
  frameworkChip: {
    backgroundColor: '#eafcff',
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 10,
    marginRight: 13,
    marginBottom: 10,
  },
  syntaxBox: {
    backgroundColor: '#f1f1fa',
    padding: 15,
    marginTop: 5,
    borderRadius: 18,
    marginBottom: 11,
  },
  syntax: {
    fontFamily: 'monospace',
    color: '#4949ce',
    fontSize: 17
  },
  factsBox: {
    backgroundColor: '#ffe8d6',
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 9,
    marginBottom: 12,
  },
  factsText: {
    fontSize: 16,
    color: '#3d5a80',
    marginBottom: 6,
  },
  // Section Cards with Voice
  sectionCard: {
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    padding: 19,
    marginBottom: 27,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4682b4',
    marginBottom: 8,
    flex: 1,
  },
  sectionVoiceButton: {
    padding: 6,
    marginLeft: 10,
  },
  sectionDesc: {
    fontSize: 16,
    marginBottom: 12,
    color: '#745c97',
  },
  // Quiz Section
  fabBtn: {
    backgroundColor: '#25289a',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 70,
    alignSelf: 'center',
  },
  fabBtnText: {
    fontWeight: 'bold',
    color: '#ffeedd',
    fontSize: 22,
    textAlign: 'center',
  },
  quizHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#097969',
    marginBottom: 21,
    marginTop: 24,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizVoiceButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 17,
    marginBottom: 22,
    elevation: 6,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 13,
  },
  questionText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#263238',
    flex: 1,
  },
  questionVoiceButton: {
    padding: 6,
    marginLeft: 10,
  },
  optionBtn: {
    padding: 14,
    backgroundColor: '#edf2fb',
    borderRadius: 14,
    marginVertical: 5,
  },
  optionBtnActive: {
    backgroundColor: '#f5d0c5',
  },
  submitBtn: {
    backgroundColor: '#eb5e28',
    padding: 22,
    borderRadius: 18,
    marginTop: 25,
    marginBottom: 90,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
  },
  lastScoreText: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 19,
    fontWeight: 'bold',
    color: '#097969',
  },
  certificateButtonWrap: {
    alignSelf: 'center',
    marginVertical: 8,
    width: '85%',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 40,
    overflow: 'hidden',
  },
});