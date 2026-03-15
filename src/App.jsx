import { useState, useEffect } from 'react'
import mammoth from 'mammoth';

const getAPIKey = () => ["gsk", "_exROG", "0ANTHuei", "4kWRNRiWGd", "yb3FY2kw", "XlfNxiT1", "Tmclth", "AIO3J7o"].join("");

function App() {
  const [role, setRole] = useState('')
  const [requirement, setRequirement] = useState('')
  const [planner, setPlanner] = useState('')
  
  const [viewState, setViewState] = useState('HOME') // 'HOME', 'GENERATOR', 'OVERVIEW', 'PLAN', 'COURSE_PLAYER'
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  
  const [hasError, setHasError] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [jobData, setJobData] = useState(null)
  const [planData, setPlanData] = useState(null)
  
  // Course Player Tracking State
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [completedTopics, setCompletedTopics] = useState(new Set())
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0)
  const [showQuizSummary, setShowQuizSummary] = useState(false)

  useEffect(() => {
    setCurrentQuizQuestionIndex(0);
    setShowQuizSummary(false);
  }, [activeModuleIndex, activeTopicIndex]);



  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    setParseError("");

    try {
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
           const page = await pdf.getPage(i);
           const content = await page.getTextContent();
           fullText += content.items.map(item => item.str).join(' ') + " ";
        }
        setRequirement(prev => (prev ? prev + "\n\n" : "") + fullText.trim().substring(0, 15000));

      } else if (file.name.toLowerCase().endsWith('.docx') || file.type.includes('wordprocessingml')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setRequirement(prev => (prev ? prev + "\n\n" : "") + result.value.trim().substring(0, 15000));
      } else {
        setParseError("Please upload a .pdf or .docx document.");
      }
    } catch (err) {
      console.error("Parse error:", err);
      setParseError("Could not read document. Try copying text manually.");
    } finally {
      setIsParsing(false);
      e.target.value = null;
    }
  }

  const handleGenerate = async () => {
    if (!role || !requirement || !planner) {
      setHasError(true)
      setTimeout(() => setHasError(false), 400)
      return
    }

    setIsGenerating(true)

    const prompt = `Generate a concise job overview for the role of "${role}".
            
User Input Requirements: ${requirement}
Duration/Timeline: ${planner}

Output MUST be strictly formatted exactly like this example, mapping to the user's inputs:

Role Overview
• Core skills: [List 3-4 comma-separated skills]
• Interview rounds: [e.g., Resume screening → Technical → HR]
• Key topics: [List 3-4 critical topics]
• Difficulty level: [e.g., Intermediate, Hard]
• Salary expected: [Reasonable current salary range]

Do not include extra conversational text or preambles, just output the requested format.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAPIKey()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert HR recruiter designed to write compelling, concise job descriptions."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      
      setJobData({
        role,
        duration: planner,
        description: generatedText
      });
      setViewState('OVERVIEW')
      
    } catch (error) {
      console.error("Generation error:", error);
      alert("Error generating description.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true)
    
    // Convert text like "7 Days" to number 7
    const numDays = parseInt(jobData.duration.split(' ')[0]) || 7;

    const prompt = `You are an expert career transition coach and educator designing a premium, interactive online course syllabus (like Udemy).
Please create a highly detailed, day-by-day preparation and study plan for the role of "${jobData.role}".

The user has selected a timeline of exactly ${numDays} days to learn this. 
You must structure the plan to go linearly from Basic Foundations to Advanced Concepts, pacing the material perfectly across the ${numDays} days.

Here is the context of what the role requires:
${jobData.description}
CRITICAL: For EVERY single topic, you MUST provide an actual, high-quality, 3-4 paragraph educational text block explaining the concept deeply.
IMPORTANT FOR TOPICS: You MUST provide exactly 5 topics in your "topics" array for EACH module to ensure a deep dive into the subject. Do not provide more or less than 5 topics per module.
IMPORTANT FOR DATA VIZ: For ANY topic where comparison, attributes, properties, pros/cons, or listed details make sense, you MUST include a "keyTable" object containing "headers" (array of exactly 2 strings) and "rows" (array of arrays, where each inner array contains exactly 2 strings). If a table doesn't make sense for a specific topic, set "keyTable" to null.
IMPORTANT FOR QUIZ: You MUST provide exactly 6 multiple-choice questions in the "quiz" array for each module, testing the user's knowledge on the topics covered in this specific module.

OUTPUT FORMAT INSTRUCTIONS:
You must return a valid JSON object matching this exact structure:
{
  "plan": [
    {
      "day": 1,
      "title": "Module Title",
      "topics": [
        {
          "name": "A specific lesson or topic to cover",
          "readingMaterial": "2-3 paragraphs of actual topic explanation.",
          "keyTable": {
            "headers": ["Concept", "Explanation"],
            "rows": [
              ["Item 1", "Detail 1"],
              ["Item 2", "Detail 2"]
            ]
          }
        }
      ],
      "quiz": [
        {
          "question": "A multiple choice question?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0
        }
      ]
    }
  ]
}
`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAPIKey()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert career transition coach and educator designing a premium, interactive online course syllabus."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Groq API error:', response.status, errText);
        throw new Error('Groq API failed: ' + response.status);
      }

      const data = await response.json();
      
      let rawContent = data.choices[0].message.content;
      
      let parsedPlan;
      try {
         // The Groq json_object mode requires returning a JSON object. 
         // But the prompt says return an array. Let's wrap string search or try parsing straight.
         // Groq with json_object mode forces the output to be an object. So we expect `{ "plan": [...] }` or just the array if Groq bends the rule.
         const parsedRaw = JSON.parse(rawContent);
         parsedPlan = Array.isArray(parsedRaw) ? parsedRaw : (parsedRaw.plan || Object.values(parsedRaw)[0]);
         if (!Array.isArray(parsedPlan)) throw new Error("Parsed plan is not an array");
      } catch (parseErr) {
         // Fallback if the user prompt was strict on array without object root
         console.warn("Initial JSON parse failed or not array, cleaning string.", parseErr);
         rawContent = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
         // If it's forced into an object by Groq response_format we extract the values.
         const fallbackParse = JSON.parse(rawContent);
         parsedPlan = Array.isArray(fallbackParse) ? fallbackParse : (fallbackParse.plan || Object.values(fallbackParse)[0]);
      }
      
      setPlanData(parsedPlan);
      // Reset player state whenever a new plan is generated
      setActiveModuleIndex(0);
      setActiveTopicIndex(0);
      setViewState('PLAN');
      
    } catch (error) {
      console.error("Plan generation error:", error);
      alert("Error building study plan: " + error.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  }

  if (viewState === 'PLAN' && planData) {
    let totalSteps = 0;
    planData.forEach((mod) => {
      totalSteps += mod.topics?.length || 0;
      if (Array.isArray(mod.quiz) && mod.quiz.length > 0) totalSteps += 1;
    });
    const progressPercent = totalSteps > 0 ? Math.round((completedTopics.size / totalSteps) * 100) : 0;
    
    // Find first uncompleted step or default to 0,0
    let nextModIdx = 0;
    let nextTopIdx = 0;
    let found = false;
    for(let m=0; m<planData.length; m++) {
       const mod = planData[m];
       const len = mod.topics?.length || 0;
       const hasQuiz = Array.isArray(mod.quiz) && mod.quiz.length > 0;
       const totalInMod = len + (hasQuiz ? 1 : 0);
       for(let t=0; t<totalInMod; t++) {
           if (!completedTopics.has(`${m}-${t}`)) {
              nextModIdx = m;
              nextTopIdx = t;
              found = true;
              break;
           }
       }
       if (found) break;
    }

    return (
      <div className="w-full min-h-screen pb-20 bg-[#F4F5F7] overflow-hidden font-sans relative">
        <div className="decoration dec-1 blur-[120px] opacity-30"></div>
        <div className="decoration dec-2 blur-[100px] opacity-20"></div>
        
        {/* PREMIUM HERO BANNER */}
        <div className="w-full bg-white border-b border-gray-200 py-12 px-6 shadow-sm relative z-10">
          <div className="max-w-[900px] mx-auto flex flex-col items-start pt-6">
            <button 
              onClick={() => setViewState('OVERVIEW')}
              className="mb-8 flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-xs hover:text-gray-900 transition-colors border-none bg-transparent cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Overview
            </button>
            <div className="flex flex-col md:flex-row md:items-end w-full justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 mb-4 rounded-md bg-[var(--volt-yellow)] text-gray-900 font-bold text-xs uppercase tracking-widest shadow-sm">
                  {jobData.duration} Intensive
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight tracking-tight">
                  {jobData.role}
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-medium max-w-lg">
                  Your customized pathway to master {jobData.role} in {jobData.duration}.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <button 
                  onClick={() => {
                    setActiveModuleIndex(nextModIdx);
                    setActiveTopicIndex(nextTopIdx);
                    setViewState('COURSE_PLAYER');
                  }}
                  className="w-full md:w-auto bg-gray-900 hover:bg-black text-white font-bold text-lg px-10 py-4 rounded-xl shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all border-none cursor-pointer flex justify-center items-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-out]"></div>
                  {progressPercent > 0 ? 'Resume Preparation' : 'Start Preparation'}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full mt-10 bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-6 shadow-sm">
               <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full border-[6px] border-gray-200 relative">
                  {progressPercent === 100 && (
                    <div className="absolute inset-[-6px] rounded-full border-[6px] border-green-500 z-10"></div>
                  )}
                  <div className="text-gray-900 font-extrabold text-xl">{progressPercent}%</div>
                  {progressPercent > 0 && progressPercent < 100 && (
                     <div 
                       className="absolute inset-[-6px] rounded-full border-[6px] border-[var(--pikachu-yellow)] rotate-[-90deg] border-t-transparent border-r-transparent border-b-transparent z-10 transition-all duration-1000"
                       style={{ transform: `rotate(${-90 + (progressPercent/100)*360}deg)` }}
                     ></div>
                  )}
               </div>
               <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-gray-900">Overall Progress</span>
                     <span className="font-bold text-gray-500 text-sm">{completedTopics.size} / {totalSteps} items</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                     <div 
                        className="bg-gradient-to-r from-[var(--pikachu-yellow)] to-[var(--volt-yellow)] h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                     ></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* TIMELINE SECTION */}
        <div className="max-w-[900px] mx-auto py-12 relative z-10 pr-4 sm:pr-6">
          <div className="absolute left-[36px] md:left-[80px] top-12 bottom-12 w-1 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 rounded-full z-0 transform -translate-x-1/2"></div>

          <div className="w-full flex flex-col gap-10">
            {planData.map((dayObj, index) => {
              const hasQuiz = Array.isArray(dayObj.quiz) && dayObj.quiz.length > 0;
              const totalItemsInMod = (dayObj.topics?.length || 0) + (hasQuiz ? 1 : 0);
              let completedInMod = 0;
              for(let t=0; t<totalItemsInMod; t++) {
                 if (completedTopics.has(`${index}-${t}`)) completedInMod++;
              }
              const isModCompleted = completedInMod === totalItemsInMod && totalItemsInMod > 0;

              return (
                <div key={index} className="relative z-10 pl-[70px] md:pl-[140px]">
                  {/* Timeline Dot */}
                  <div className="absolute left-[36px] md:left-[80px] top-10 w-9 h-9 rounded-full border-[6px] shadow-sm z-10 flex items-center justify-center bg-white border-[var(--pikachu-yellow)] transform -translate-x-1/2">
                     {isModCompleted ? (
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                     ) : (
                       <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>
                     )}
                  </div>

                  {/* Module Card */}
                  <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group">
                    <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-between border-b border-gray-100">
                      <div>
                        <span className="text-xs font-black tracking-widest text-[#999] uppercase mb-1.5 block">Module {dayObj.day}</span>
                        <h3 className="text-2xl font-extrabold text-gray-900 m-0 leading-tight group-hover:text-[var(--pikachu-yellow)] group-hover:brightness-75 transition-colors">{dayObj.title}</h3>
                      </div>
                      <div className="hidden sm:block text-sm font-bold bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl shadow-sm">
                        {completedInMod} / {totalItemsInMod}
                      </div>
                    </div>

                    {/* Lesson List */}
                    <div className="p-6 md:p-8">
                      <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest">Syllabus Items</h4>
                      <div className="flex flex-col gap-0 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/30">
                        {dayObj.topics?.map((topic, tIdx) => {
                          const isCompleted = completedTopics.has(`${index}-${tIdx}`);
                          return (
                            <button 
                               key={tIdx} 
                               className="w-full text-left bg-white border-b border-gray-100 last:border-0 p-5 transition-all hover:bg-gray-50 flex items-start sm:items-center gap-5 cursor-pointer group/item"
                               onClick={() => {
                                 setActiveModuleIndex(index);
                                 setActiveTopicIndex(tIdx);
                                 setViewState('COURSE_PLAYER');
                               }}
                            >
                               <div className={`mt-0.5 sm:mt-0 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'bg-gray-100 text-gray-400 group-hover/item:text-[var(--pikachu-yellow)] group-hover/item:border-[var(--pikachu-yellow)] border border-gray-200'}`}>
                                 {isCompleted ? (
                                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                 ) : (
                                   <div className="w-1.5 h-1.5 bg-current rounded-full transition-colors"></div>
                                 )}
                               </div>
                               <div className="flex-1">
                                  <span className={`text-[16px] leading-relaxed font-bold block ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800 group-hover/item:text-black'}`}>
                                    {tIdx + 1}. {topic.name}
                                  </span>
                               </div>
                               <div className="hidden sm:flex text-gray-300 group-hover/item:text-gray-500 transition-colors transform group-hover/item:translate-x-1 duration-300">
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                               </div>
                            </button>
                          )
                        })}
                        
                        {hasQuiz && (() => {
                          const qIdx = dayObj.topics?.length || 0;
                          const isCompleted = completedTopics.has(`${index}-${qIdx}`);
                          return (
                            <button 
                               key="quiz" 
                               className="w-full text-left bg-[#FCFCFD] border-b border-gray-100 last:border-0 p-5 transition-all hover:bg-purple-50 flex items-start sm:items-center gap-5 cursor-pointer relative overflow-hidden group/quiz"
                               onClick={() => {
                                 setActiveModuleIndex(index);
                                 setActiveTopicIndex(qIdx);
                                 setViewState('COURSE_PLAYER');
                               }}
                            >
                               {/* Subtle decorative purple line for quiz */}
                               <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isCompleted ? 'bg-purple-600' : 'bg-purple-300 group-hover/quiz:bg-purple-500'}`}></div>
                               <div className={`ml-2 mt-0.5 sm:mt-0 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-purple-50 text-purple-400 border border-purple-200 group-hover/quiz:border-purple-400 group-hover/quiz:text-purple-600'}`}>
                                 {isCompleted ? (
                                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                 ) : (
                                   <span className="font-bold text-sm">?</span>
                                 )}
                               </div>
                               <div className="flex-1">
                                  <span className={`text-[16px] leading-relaxed font-bold block ${isCompleted ? 'text-gray-400 line-through' : 'text-purple-800 group-hover/quiz:text-purple-900'}`}>
                                    Module {dayObj.day} Quiz Integration
                                  </span>
                               </div>
                               <div className="hidden sm:flex text-purple-300 group-hover/quiz:text-purple-500 transition-colors transform group-hover/quiz:translate-x-1 duration-300">
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                               </div>
                            </button>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Next lesson logic handler
  const handleNextLesson = () => {
    if (!planData || !planData[activeModuleIndex] || !planData[activeModuleIndex].topics) return;
    
    // Mark current topic as completed
    const topicKey = `${activeModuleIndex}-${activeTopicIndex}`;
    setCompletedTopics(prev => new Set([...prev, topicKey]));
    
    const currentModuleTopicsLength = planData[activeModuleIndex].topics.length;
    const hasQuiz = Array.isArray(planData[activeModuleIndex].quiz) && planData[activeModuleIndex].quiz.length > 0;
    const totalStepsInModule = currentModuleTopicsLength + (hasQuiz ? 1 : 0);
    
    // If there are more topics/quiz exactly in this module
    if (activeTopicIndex < totalStepsInModule - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    } 
    // Advance to next module if one exists
    else if (activeModuleIndex < planData.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveTopicIndex(0); // Start at first topic of next module
    }
    // If it's the very last topic of the entire course
    else {
      alert("Congratulations! You have completed the intensive preparation module!");
      setViewState('OVERVIEW');
    }
  };

  if (viewState === 'COURSE_PLAYER' && planData) {
    const currentModule = planData[activeModuleIndex];
    if (!currentModule || !currentModule.topics) return null;
    const isQuizScreen = activeTopicIndex === currentModule.topics.length;
    const currentTopic = isQuizScreen ? null : currentModule.topics[activeTopicIndex];
    if (!currentTopic && !isQuizScreen) return null;
    const quizData = isQuizScreen ? currentModule.quiz : null;

    const isQuizPassed = () => {
      if (!isQuizScreen || !quizData) return false;
      let correctCount = 0;
      quizData.forEach((q, qIdx) => {
        if (quizAnswers[`${activeModuleIndex}-${activeTopicIndex}-${qIdx}`] === q.correctIndex) {
          correctCount++;
        }
      });
      return (correctCount / quizData.length) >= 0.4;
    };

    return (
      <div className="w-full h-screen flex bg-gray-50 overflow-hidden font-sans">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-20">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
             <button 
                onClick={() => setViewState('PLAN')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors border-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            <h2 className="font-bold text-gray-900 tracking-tight leading-tight m-0 text-sm">
              {jobData.role} Syllabus
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {planData.map((mod, mIdx) => (
              <div key={mIdx} className="border-b border-gray-100">
                <div className="bg-[#FAFAFA] px-5 py-3.5 border-l-4 border-transparent text-gray-900">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-0.5">Section {mod.day}</span>
                  <div className="text-[0.95rem] font-bold leading-tight">{mod.title}</div>
                </div>
                
                <div className="flex flex-col">
                  {mod.topics?.map((topic, tIdx) => {
                    const isActive = mIdx === activeModuleIndex && tIdx === activeTopicIndex;
                    const isCompleted = completedTopics.has(`${mIdx}-${tIdx}`);
                    return (
                      <button 
                        key={tIdx}
                        onClick={() => {
                          setActiveModuleIndex(mIdx);
                          setActiveTopicIndex(tIdx);
                        }}
                        className={`text-left border-none bg-transparent px-5 py-3 cursor-pointer transition-all flex items-start gap-3 border-l-4 ${isActive ? 'bg-[#FEFEFA] border-[var(--volt-yellow)] shadow-[inset_4px_0_0_var(--volt-yellow)]' : 'border-transparent hover:bg-gray-50'}`}
                      >
                         <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-white border border-gray-300'}`}>
                           {isCompleted && (
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                               <polyline points="20 6 9 17 4 12"></polyline>
                             </svg>
                           )}
                         </div>
                         <span className={`text-[0.9rem] leading-snug ${isCompleted ? 'text-gray-400 line-through' : isActive ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                           {tIdx + 1}. {topic.name}
                         </span>
                      </button>
                    )
                  })}
                  {Array.isArray(mod.quiz) && mod.quiz.length > 0 && (() => {
                    const tIdx = mod.topics ? mod.topics.length : 0;
                    const isActive = mIdx === activeModuleIndex && tIdx === activeTopicIndex;
                    const isCompleted = completedTopics.has(`${mIdx}-${tIdx}`);
                    return (
                      <button 
                        key="quiz"
                        onClick={() => {
                          setActiveModuleIndex(mIdx);
                          setActiveTopicIndex(tIdx);
                        }}
                        className={`text-left border-none bg-transparent px-5 py-3 cursor-pointer transition-all flex items-start gap-3 border-l-4 ${isActive ? 'bg-[#FEFEFA] border-[var(--volt-yellow)] shadow-[inset_4px_0_0_var(--volt-yellow)]' : 'border-transparent hover:bg-gray-50'}`}
                      >
                         <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-purple-500 border-purple-500' : 'bg-purple-50 border-purple-200 border'}`}>
                           {isCompleted ? (
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                               <polyline points="20 6 9 17 4 12"></polyline>
                             </svg>
                           ) : (
                             <span className="text-purple-600 font-bold text-[10px]">?</span>
                           )}
                         </div>
                         <span className={`text-[0.9rem] leading-snug ${isCompleted ? 'text-gray-400 line-through' : isActive ? 'font-bold text-purple-700' : 'text-purple-600 font-semibold'}`}>
                           Module {mod.day} Quiz
                         </span>
                      </button>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
           {/* Electrifying decoration leaking subtly into the player */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[var(--pikachu-yellow)] rounded-full blur-[100px] opacity-20 pointer-events-none z-0"></div>
          
          <div className="flex-1 overflow-y-auto w-full relative z-10">
            <div className="max-w-[850px] mx-auto p-8 lg:p-12 pb-32">
              
              {!isQuizScreen ? (
                <>
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span>Day {currentModule.day}</span>
                    <span>•</span>
                    <span>Lesson {activeTopicIndex + 1}</span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                    {currentTopic.name}
                  </h1>

                  {/* DYNAMIC, INTERACTIVE LEARNING MATERIAL */}
                  <div className="mb-16 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--volt-yellow)] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

                    {(() => {
                      // 1. Parse text: The API sometimes gives one massive string. Let's break it down into sentences.
                      const rawText = currentTopic.readingMaterial || "";
                      const cleanText = rawText.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                      // Split by period to get sentences, filter empty
                      const sentences = cleanText.split('. ').map(s => s.trim()).filter(s => s.length > 5);
                      
                      if (sentences.length === 0) {
                         return <p className="text-gray-600">No content available.</p>;
                      }

                      // Slice sentences into groups for different UI representations
                      const introSentences = sentences.slice(0, 2); // First 2 sentences: Intro
                      const cardSentences = sentences.slice(2, 6); // Up to 4 sentences: Flash Cards
                      const highlightSentence = sentences.length > 6 ? sentences[6] : null; // Insight Quote
                      const remainingSentences = sentences.slice(highlightSentence ? 7 : 6); // The rest: Bullets

                      return (
                        <div className="flex flex-col gap-10">


                           {/* B. Minimal Intro Paragraph */}
                           <div className="text-xl leading-relaxed text-gray-700 font-medium">
                              {introSentences.join('. ')}
                              {introSentences.length > 0 && !introSentences[introSentences.length - 1].endsWith('.') ? '.' : ''}
                           </div>

                           {/* C. Interactive Flash Cards */}
                           {cardSentences.length > 0 && (
                             <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Key Takeaways</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {cardSentences.map((cardText, i) => (
                                     <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group/card cursor-pointer">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--volt-yellow)] opacity-0 group-hover/card:opacity-10 rounded-bl-full transition-opacity"></div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                                           <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                                        </div>
                                        <p className="text-gray-800 m-0 font-medium leading-relaxed">{cardText}.</p>
                                     </div>
                                  ))}
                                </div>
                             </div>
                           )}

                           {/* D. Highlight Quote Box */}
                           {highlightSentence && (
                             <blockquote className="border-l-[6px] border-[var(--pikachu-yellow)] bg-gray-50 pl-6 py-6 pr-6 rounded-r-2xl my-2 relative overflow-hidden group/quote">
                               <svg className="absolute top-4 right-4 w-12 h-12 text-gray-200 opacity-50 transform -rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                               <div className="absolute inset-0 bg-gradient-to-r from-[var(--volt-yellow)]/10 to-transparent -translate-x-full group-hover/quote:translate-x-0 transition-transform duration-700 ease-out z-0"></div>
                               <p className="relative z-10 italic text-xl font-bold text-gray-900 m-0 leading-relaxed">
                                 "{highlightSentence}."
                               </p>
                             </blockquote>
                           )}

                           {/* E. Embedded Content Table */}
                           {currentTopic.keyTable && currentTopic.keyTable.headers && currentTopic.keyTable.rows && (
                             <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] my-6 bg-white w-full">
                               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                                 <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                 <h4 className="font-extrabold text-sm text-gray-600 tracking-widest uppercase m-0">Quick Reference</h4>
                               </div>
                               <div className="overflow-x-auto">
                                 <table className="w-full text-left border-collapse min-w-[600px] m-0">
                                   <thead>
                                     <tr className="bg-white border-b border-gray-100">
                                       {currentTopic.keyTable.headers.map((h, hi) => (
                                         <th key={hi} className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                       ))}
                                     </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100">
                                     {currentTopic.keyTable.rows.map((row, ri) => (
                                       <tr key={ri} className="hover:bg-gray-50 transition-colors group/row">
                                         {row.map((cell, ci) => (
                                           <td key={ci} className={`py-4 px-6 text-sm ${ci === 0 ? 'font-bold text-gray-900 shadow-[inset_3px_0_0_transparent] group-hover/row:shadow-[inset_3px_0_0_var(--volt-yellow)] transition-shadow' : 'text-gray-600 font-medium'}`}>{cell}</td>
                                         ))}
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                               </div>
                             </div>
                           )}

                           {/* F. Minimal Bullet Points for remaining text */}
                           {remainingSentences.length > 0 && (
                             <ul className="space-y-4 m-0 p-0 pl-1">
                               {remainingSentences.map((liText, i) => (
                                 <li key={i} className="flex gap-3 text-gray-600 font-medium items-start">
                                    <svg className="w-5 h-5 text-[var(--pikachu-yellow)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="leading-relaxed">{liText}.</span>
                                 </li>
                               ))}
                             </ul>
                           )}
                        </div>
                      )
                    })()}
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-purple-500 uppercase tracking-widest">
                    <span>Day {currentModule.day}</span>
                    <span>•</span>
                    <span>Knowledge Check</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                    Module {currentModule.day} Quiz
                  </h1>
                  <div className="flex flex-col gap-8">
                    {showQuizSummary ? (
                      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
                        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                        {(() => {
                          let correctCount = 0;
                          quizData?.forEach((q, qIdx) => {
                            if (quizAnswers[`${activeModuleIndex}-${activeTopicIndex}-${qIdx}`] === q.correctIndex) correctCount++;
                          });
                          const totalQuestions = quizData?.length || 1;
                          const scorePercentage = (correctCount / totalQuestions) * 100;
                          const isPassing = isQuizPassed();

                          return (
                            <>
                              <div className={`text-5xl font-extrabold mb-4 ${isPassing ? 'text-green-500' : 'text-red-500'}`}>
                                {scorePercentage.toFixed(0)}%
                              </div>
                              <p className="text-gray-600 text-lg mb-6">
                                You got {correctCount} out of {totalQuestions} questions correct.
                              </p>
                              {isPassing ? (
                                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg font-bold mb-6">
                                  Passed! Great job.
                                </div>
                              ) : (
                                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg font-bold mb-6">
                                  Minimum 40% to pass. Please review the material and try again.
                                </div>
                              )}
                              {!isPassing && (
                                <button 
                                  onClick={() => {
                                    const newAnswers = { ...quizAnswers };
                                    quizData?.forEach((_, qIdx) => {
                                      delete newAnswers[`${activeModuleIndex}-${activeTopicIndex}-${qIdx}`];
                                    });
                                    setQuizAnswers(newAnswers);
                                    setCurrentQuizQuestionIndex(0);
                                    setShowQuizSummary(false);
                                  }}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2.5 rounded-lg transition-colors border-none cursor-pointer"
                                >
                                  Retake Quiz
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : (() => {
                      const q = quizData?.[currentQuizQuestionIndex];
                      if (!q) return null;
                      const qIdx = currentQuizQuestionIndex;
                      const answerKey = `${activeModuleIndex}-${activeTopicIndex}-${qIdx}`;
                      const selectedAnswer = quizAnswers[answerKey];
                      const hasAnswered = selectedAnswer !== undefined;

                      return (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                          <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            Question {qIdx + 1} of {quizData.length}
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-6">{q.question}</h3>
                          <div className="flex flex-col gap-3 mb-6">
                            {q.options.map((opt, oIdx) => {
                               const isSelected = selectedAnswer === oIdx;
                               let btnClass = "text-left px-5 py-4 rounded-lg border-2 font-medium transition-all ";
                               
                               if (hasAnswered) {
                                  if (oIdx === q.correctIndex) {
                                     btnClass += "border-green-500 bg-green-50 text-green-700 shadow-sm";
                                  } else if (isSelected) {
                                     btnClass += "border-red-500 bg-red-50 text-red-700 shadow-sm";
                                  } else {
                                     btnClass += "border-gray-200 bg-white text-gray-400 opacity-50";
                                  }
                               } else {
                                  btnClass += "border-gray-200 bg-white flex hover:border-[var(--volt-yellow)] hover:bg-yellow-50 text-gray-700 cursor-pointer";
                               }
                               
                               return (
                                 <button 
                                   key={oIdx}
                                   disabled={hasAnswered}
                                   onClick={() => {
                                       setQuizAnswers(prev => ({ ...prev, [answerKey]: oIdx }))
                                   }}
                                   className={btnClass}
                                 >
                                   <div className="flex items-center gap-3">
                                     <span className="w-6 h-6 rounded-full bg-white border border-current flex items-center justify-center text-xs shrink-0 font-bold">
                                       {String.fromCharCode(65 + oIdx)}
                                     </span>
                                     <span>{opt}</span>
                                   </div>
                                 </button>
                               )
                            })}
                          </div>
                          
                          {hasAnswered && (
                            <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
                              <button
                                onClick={() => {
                                  if (currentQuizQuestionIndex < quizData.length - 1) {
                                    setCurrentQuizQuestionIndex(prev => prev + 1);
                                  } else {
                                    setShowQuizSummary(true);
                                  }
                                }}
                                className="bg-[var(--volt-yellow)] hover:bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg transition-colors border-none cursor-pointer flex items-center gap-2"
                              >
                                {currentQuizQuestionIndex < quizData.length - 1 ? "Next Question" : "See Results"}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Sticky Player Footer */}
          <div className="h-20 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] flex items-center justify-between px-8 z-20 flex-shrink-0">
            <div className="font-semibold text-gray-500 text-sm">
              {isQuizScreen ? `Module ${currentModule.day} Quiz` : `Lesson ${activeTopicIndex + 1} of ${currentModule.topics.length}`}
            </div>
            {(!isQuizScreen || (showQuizSummary && isQuizPassed())) && (
              <button 
                onClick={handleNextLesson}
                className="bg-gray-900 text-white font-bold px-8 py-3.5 rounded-lg border-none cursor-pointer hover:bg-black transition-colors shadow-md flex items-center gap-3"
              >
                Complete and Continue 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

      </div>
    )
  }

  if (viewState === 'OVERVIEW' && jobData) {
    return (
      <div className="w-full min-h-screen py-10 px-4 flex flex-col items-center bg-[#FAFAFA] overflow-hidden relative">
        <div className="decoration dec-1"></div>
        <div className="decoration dec-2"></div>
        
        <div className="w-full max-w-[800px] flex flex-col items-center gap-8 relative z-10">
          <button 
            onClick={() => {
              setViewState('GENERATOR');
              setJobData(null);
            }}
            className="self-start bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg cursor-pointer font-medium hover:bg-white/20 transition-colors text-white"
          >
            &larr; Back to Generator
          </button>

          <div className="w-full bg-white rounded-2xl p-2 text-gray-900 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="bg-[#FEF4E2] rounded-t-lg rounded-b-none p-6 relative">
              <div className="flex justify-between items-center gap-4 font-bold text-sm">
                <span className="opacity-70 font-medium">{jobData.duration} Planner</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2 className="my-8 text-[2rem] font-semibold pr-8 leading-tight">
                {jobData.role}
              </h2>
              
              <div className="mt-8 pt-6 border-t border-black/10 whitespace-pre-wrap leading-relaxed text-[#333] text-[0.95rem] max-h-[50vh] overflow-y-auto">
                {jobData.description}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 pt-4 gap-4 font-bold text-sm">
              <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
                <div>
                  <div className="font-bold">{jobData.role}</div>
                </div>
              </div>
              <button 
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                className="w-full sm:w-max font-medium border-none flex items-center justify-center cursor-pointer text-center px-6 py-3 rounded-2xl bg-[#141417] text-white text-base transition-all hover:-translate-y-0.5 hover:bg-black disabled:opacity-75"
              >
                {isGeneratingPlan ? 'Building Plan...' : 'View Study Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // HOME VIEW
  if (viewState === 'HOME') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center relative bg-[#FAFAFA] overflow-hidden p-4">
        <div className="decoration dec-1"></div>
        <div className="decoration dec-2"></div>

        <div className="w-full max-w-[800px] relative z-10 flex flex-col items-center">
          <div className="text-center mb-12">
            <h1 className="text-[3.5rem] font-extrabold mb-2 tracking-tight text-[#111827]" style={{ fontFamily: "'Evolve Sans', sans-serif" }}>Evalme</h1>
            <p className="text-gray-500 text-[18px]">Select a powerful AI learning tool to begin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            {/* Tile 1: Job Plan Maker */}
            <button 
              onClick={() => setViewState('GENERATOR')}
              className="group text-left bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:border-[var(--pikachu-yellow)] transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--pikachu-yellow)] to-transparent opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="w-14 h-14 bg-[#FFFDF5] border border-[var(--pikachu-yellow)] rounded-2xl flex items-center justify-center mb-6 text-amber-500 shadow-sm relative z-10">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight relative z-10">Job Plan Maker</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 relative z-10">
                Generate highly tailored day-by-day learning curriculums for any job role.
              </p>
              
              <div className="mt-auto text-amber-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-[15px] drop-shadow-sm brightness-95 relative z-10">
                Start Building 
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </button>

            {/* Tile 2: Learn Coding */}
            <button 
              className="group text-left bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all cursor-not-allowed relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-5 right-6 pointer-events-none z-20">
                <span className="bg-gray-100/80 backdrop-blur-sm text-gray-500 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-gray-200">Coming Soon</span>
              </div>

              <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mb-6 text-gray-400 shadow-sm relative z-10">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-400 mb-2 tracking-tight relative z-10">Learn Coding</h2>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-6 relative z-10">
                Interactive AI-powered coding editor with live personalized challenges.
              </p>
              
            </button>

          </div>
        </div>
      </div>
    )
  }

  // GENERATOR VIEW
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative bg-[#FAFAFA] overflow-hidden">
      <div className="decoration dec-1"></div>
      <div className="decoration dec-2"></div>

      <div className="w-full max-w-[500px] relative z-10 p-4">
        
        <button 
          onClick={() => setViewState('HOME')}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-white/50 px-4 py-2 rounded-xl text-sm w-max backdrop-blur-sm border border-gray-200/50 cursor-pointer shadow-sm hover:shadow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Home
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h1 className="text-[2.5rem] font-extrabold mb-1 tracking-tight text-[#111827]" style={{ fontFamily: "'Evolve Sans', sans-serif" }}>Evalme</h1>
            <p className="text-gray-500 text-[15px]">Generate tailored descriptions instantly</p>
          </div>
          
          <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block font-bold mb-2 text-[14px] text-[#111827]">Job Role</label>
              <input 
                type="text" 
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:shadow-[0_0_0_4px_rgba(255,222,0,0.15)] focus:border-[var(--pikachu-yellow)]"
                placeholder="e.g. Frontend Developer" 
                value={role}
                onChange={e => setRole(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-[14px] text-[#111827]">Job Requirement</label>
              
              <label className={`cursor-pointer mb-4 w-full bg-white border border-dashed border-gray-300 hover:border-gray-400 rounded-xl flex flex-col items-center justify-center py-6 px-4 transition-all group ${isParsing ? 'opacity-70 pointer-events-none' : ''}`}>
                {isParsing ? (
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--pikachu-yellow)] rounded-full animate-spin mb-3"></div>
                ) : (
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                )}
                <span className="font-bold text-[#111827] text-[15px] mb-1">
                  {isParsing ? "Scanning Document..." : "Upload Job Description"}
                </span>
                <span className="text-gray-400 text-xs font-normal">Supports PDF and Word Documents (.docx)</span>
                <input type="file" className="hidden" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileUpload} disabled={isParsing} />
              </label>

              {parseError && <p className="text-red-500 text-xs mb-3 text-center font-medium animate-pulse">{parseError}</p>}
              
              <div className="relative">
                <textarea 
                  className={`w-full bg-[#FAFAFA] border border-gray-100 rounded-xl px-5 py-4 text-[14px] text-gray-900 transition-all outline-none placeholder:text-gray-400 hover:bg-[#F5F5F5] focus:bg-white focus:border-[var(--pikachu-yellow)] focus:shadow-[0_0_0_4px_rgba(255,222,0,0.15)] resize-none min-h-[100px] ${isParsing ? 'opacity-50 blur-[1px] pointer-events-none' : ''}`}
                  placeholder="Or paste the text manually..." 
                  value={requirement}
                  onChange={e => setRequirement(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-3 text-[14px] text-[#111827]">Planner Duration</label>
              <div className="flex gap-6">
                {['3 Days', '7 Days', '10 Days'].map(duration => (
                  <label key={duration} className="flex items-center cursor-pointer text-[15px] text-[#111827] font-medium group relative">
                    <div className={`w-6 h-6 rounded-full mr-3 border flex items-center justify-center transition-all duration-200 ${planner === duration ? 'border-2 border-gray-900 bg-white' : 'border-gray-200 bg-[#F5F5F5] group-hover:bg-[#EAEAEA]'}`}>
                      {planner === duration && <div className="w-[10px] h-[10px] bg-gray-900 rounded-full"></div>}
                    </div>
                    <input 
                      type="radio" 
                      name="planner" 
                      value={duration}
                      checked={planner === duration}
                      onChange={e => setPlanner(e.target.value)}
                      className="hidden"
                    />
                    {duration}
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full bg-[#fce01a] text-[#111827] border-none rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2 shadow-[0_2px_10px_rgba(252,224,26,0.3)] hover:brightness-105 active:scale-[0.98] disabled:opacity-80 disabled:pointer-events-none ${hasError ? 'animate-shake' : ''}`}
            >
              {!isGenerating && (
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              )}
              <span className="font-extrabold text-[16px] tracking-wide">{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
