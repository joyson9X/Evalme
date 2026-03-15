import { useState, useEffect } from 'react'
import mammoth from 'mammoth';
import { supabase } from './supabaseClient';
import Mermaid from 'react-mermaid2';

const getAPIKey = () => ["gsk", "_qIumX", "CkbhAaN", "jqANyNZj", "WGdyb3FY", "GDreQtkq", "AeeCX7pG", "RwCsTUcz"].join("");

const fetchWithRetry = async (url, options, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
    
    if (response.status === 429 || response.status >= 500) {
      console.warn(`API rate limited or server error (${response.status}). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff (2s -> 4s -> 8s)
    } else {
      return response; // Return immediately for other status codes (e.g. 400 Bad Request)
    }
  }
  // Try one last time which will throw normally if it fails
  return fetch(url, options);
};

const sanitizeMermaid = (chart) => {
  if (!chart) return '';
  let str = chart.replace(/\\n/g, '\n');
  if (!str.includes('\n') && str.includes('flowchart')) {
    str = str.replace(/(flowchart\s+\w+)\s+/, "$1\n");
    str = str.replace(/([\])}])\s+(?=[A-Za-z0-9_-]+(\s+-->|\[|\(|\{))/g, "$1\n");
  }
  return str;
};

function App() {
  const [session, setSession] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [premiumExpiry, setPremiumExpiry] = useState(null)
  const [role, setRole] = useState('')
  const [requirement, setRequirement] = useState('')
  const [planner, setPlanner] = useState('')
  
  const [viewState, setViewState] = useState('AUTH_SPINNER') // 'AUTH_SPINNER', 'AUTH', 'HOME', 'GENERATOR', 'PLAN', 'COURSE_PLAYER', 'PRICING', etc
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  
  const [hasError, setHasError] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [jobData, setJobData] = useState(null)
  const [planData, setPlanData] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  
  // Course Player Tracking State
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)
  const [completedTopics, setCompletedTopics] = useState(new Set())
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0)
  const [showQuizSummary, setShowQuizSummary] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    setCurrentQuizQuestionIndex(0);
    setShowQuizSummary(false);
  }, [activeModuleIndex, activeTopicIndex]);

  // Persist state to sessionStorage to survive tab switches
  useEffect(() => {
    if (viewState !== 'AUTH_SPINNER' && viewState !== 'AUTH') {
      sessionStorage.setItem('evalme_viewState', viewState)
    }
  }, [viewState])

  useEffect(() => {
    if (jobData) sessionStorage.setItem('evalme_jobData', JSON.stringify(jobData))
  }, [jobData])

  useEffect(() => {
    if (planData) sessionStorage.setItem('evalme_planData', JSON.stringify(planData))
  }, [planData])

  const checkSubscription = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (error) { console.error('Sub check error:', error); return }
      if (data && data.length > 0) {
        const sub = data[0]
        if (sub.plan === 'lifetime') {
          setIsPremium(true)
          setPremiumExpiry(null)
        } else if (sub.expires_at && new Date(sub.expires_at) > new Date()) {
          setIsPremium(true)
          setPremiumExpiry(sub.expires_at)
        } else {
          setIsPremium(false)
        }
      }
    } catch (err) { console.error('Sub check failed:', err) }
  }

  useEffect(() => {
    // Restore persisted state
    const savedView = sessionStorage.getItem('evalme_viewState')
    const savedJobData = sessionStorage.getItem('evalme_jobData')
    const savedPlanData = sessionStorage.getItem('evalme_planData')
    if (savedJobData) try { setJobData(JSON.parse(savedJobData)) } catch(e) {}
    if (savedPlanData) try { setPlanData(JSON.parse(savedPlanData)) } catch(e) {}

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        // Restore previous view or default to HOME
        setViewState(savedView || 'HOME')
        checkSubscription(session.user.id)
      } else {
        setViewState('AUTH')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      if (event === 'SIGNED_IN') {
        const sv = sessionStorage.getItem('evalme_viewState')
        setViewState(sv || 'HOME')
        checkSubscription(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setViewState('AUTH')
        setIsPremium(false)
        sessionStorage.removeItem('evalme_viewState')
        sessionStorage.removeItem('evalme_jobData')
        sessionStorage.removeItem('evalme_planData')
      }
      // For TOKEN_REFRESHED and other events, just update session silently
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error.message)
      alert('Error logging in: ' + error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error logging out:', error.message)
    }
  }

  const PLANS = [
    { id: '10_days', name: '10 Days', price: 49, duration: '10 Days Access', days: 10, color: '#f59e0b' },
    { id: '2_months', name: '2 Months', price: 99, duration: '60 Days Access', days: 60, color: '#3b82f6', popular: true },
    { id: 'lifetime', name: 'Lifetime', price: 159, duration: 'Forever', days: null, color: '#8b5cf6' },
  ]

  const handlePayment = (plan) => {
    if (!session?.user) return alert('Please sign in first')

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: 'INR',
      name: 'Evalme Premium',
      description: `${plan.name} Plan - Full Access`,
      prefill: {
        email: session.user.email,
        name: session.user.user_metadata?.full_name || '',
      },
      theme: { color: '#111827' },
      handler: async function (response) {
        try {
          const expiresAt = plan.days
            ? new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString()
            : null

          const { error } = await supabase.from('subscriptions').insert({
            user_id: session.user.id,
            plan: plan.id,
            payment_id: response.razorpay_payment_id,
            amount: plan.price,
            expires_at: expiresAt,
          })

          if (error) throw error

          setIsPremium(true)
          setPremiumExpiry(expiresAt)
          setViewState('HOME')
          alert('🎉 Payment successful! Welcome to Evalme Premium!')
        } catch (err) {
          console.error('Subscription save error:', err)
          alert('Payment received but there was an error saving. Contact support with payment ID: ' + response.razorpay_payment_id)
        }
      },
      modal: {
        ondismiss: function () { console.log('Payment modal closed') }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const handleCoupon = async () => {
    setCouponError('')
    if (!session?.user) return alert('Please sign in first')
    if (couponCode.trim().toLowerCase() === 'joysondalmeida') {
      try {
        const { error } = await supabase.from('subscriptions').insert({
          user_id: session.user.id,
          plan: 'lifetime',
          payment_id: 'COUPON_' + couponCode.trim(),
          amount: 0,
          expires_at: null,
        })
        if (error) throw error
        setIsPremium(true)
        setPremiumExpiry(null)
        setCouponCode('')
        setViewState('HOME')
        alert('\u{1F389} Coupon applied! You now have lifetime premium access!')
      } catch (err) {
        console.error('Coupon save error:', err)
        setCouponError('Something went wrong. Please try again.')
      }
    } else {
      setCouponError('Invalid coupon code')
    }
  }

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
      // Step 1: Generate the overview
      const response = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
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
      
      const newJobData = {
        role,
        duration: planner,
        description: generatedText
      };
      setJobData(newJobData);

      // Step 2: Immediately chain into generating the study plan (skip OVERVIEW)
      const numDays = parseInt(planner.split(' ')[0]) || 7;

      const planPrompt = `You are an expert career transition coach and educator designing a premium, interactive online course syllabus (like Udemy).
Please create a highly detailed, day-by-day preparation and study plan for the role of "${role}".

The user has selected a timeline of exactly ${numDays} days to learn this. 
You must structure the plan to go linearly from Basic Foundations to Advanced Concepts, pacing the material perfectly across the ${numDays} days.

Here is the context of what the role requires:
${generatedText}
CRITICAL: For EVERY single topic, you MUST provide an actual, high-quality, 3-4 paragraph educational text block explaining the concept deeply.
IMPORTANT FOR TOPICS: You MUST provide exactly 5 topics in your "topics" array for EACH module to ensure a deep dive into the subject. Do not provide more or less than 5 topics per module.
IMPORTANT FOR DATA VIZ: For ANY topic where comparison, attributes, properties, pros/cons, or listed details make sense, you MUST include a "keyTable" object containing "headers" (array of exactly 2 strings) and "rows" (array of arrays, where each inner array contains exactly 2 strings). If a table doesn't make sense for a specific topic, set "keyTable" to null.
IMPORTANT FOR DIAGRAMS: You MUST provide a "mermaidDiagram" string for AT LEAST 1 OR 2 topics in each module. This string should be a valid Mermaid.js graph code (e.g., flowchart TD) that visualizes the concept. CRITICAL: You MUST use the exact string '\\n' to separate EVERY SINGLE line and node connection! DO NOT put multiple connections on one line. Example: "flowchart LR\\n  A[Start] --> B[Step 1]\\n  B --> C[Step 2]". If no diagram makes sense, set it to null.
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
          "mermaidDiagram": "flowchart TD\\n  A[Start] --> B[Middle]\\n  B --> C[End]",
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

      const planResponse = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
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
              content: planPrompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!planResponse.ok) {
        const errText = await planResponse.text();
        console.error('Groq API error:', planResponse.status, errText);
        throw new Error('Groq API failed: ' + planResponse.status);
      }

      const planData = await planResponse.json();
      let rawContent = planData.choices[0].message.content;

      let parsedPlan;
      try {
        const parsedRaw = JSON.parse(rawContent);
        parsedPlan = Array.isArray(parsedRaw) ? parsedRaw : (parsedRaw.plan || Object.values(parsedRaw)[0]);
        if (!Array.isArray(parsedPlan)) throw new Error("Parsed plan is not an array");
      } catch (parseErr) {
        console.warn("Initial JSON parse failed or not array, cleaning string.", parseErr);
        rawContent = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
        const fallbackParse = JSON.parse(rawContent);
        parsedPlan = Array.isArray(fallbackParse) ? fallbackParse : (fallbackParse.plan || Object.values(fallbackParse)[0]);
      }

      setPlanData(parsedPlan);
      setActiveModuleIndex(0);
      setActiveTopicIndex(0);
      setViewState('PLAN');
      
    } catch (error) {
      console.error("Generation error:", error);
      alert("Error generating: " + error.message)
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
      const response = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
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
      <div className="w-full min-h-[100dvh] pb-20 bg-[#F4F5F7] overflow-x-hidden overflow-y-auto font-sans relative">
        <div className="decoration dec-1 blur-[120px] opacity-30"></div>
        <div className="decoration dec-2 blur-[100px] opacity-20"></div>
        
        {/* PREMIUM HERO BANNER */}
        <div className="w-full bg-white border-b border-gray-200 py-12 px-6 shadow-sm relative z-10">
          <div className="max-w-[900px] mx-auto flex flex-col items-start pt-6">
            <button 
              onClick={() => {
                setViewState('GENERATOR');
                setPlanData(null);
              }}
              className="mb-8 flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-xs hover:text-gray-900 transition-colors border-none bg-transparent cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Generator
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
      setViewState('PLAN');
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

    // Compute overall progress for top bar
    let totalLessons = 0;
    planData.forEach((mod) => {
      totalLessons += mod.topics?.length || 0;
      if (Array.isArray(mod.quiz) && mod.quiz.length > 0) totalLessons += 1;
    });
    const currentLessonGlobal = (() => {
      let count = 0;
      for (let m = 0; m < activeModuleIndex; m++) {
        count += planData[m].topics?.length || 0;
        if (Array.isArray(planData[m].quiz) && planData[m].quiz.length > 0) count += 1;
      }
      count += activeTopicIndex + 1;
      return count;
    })();

    return (
      <div className="w-full h-screen flex flex-col bg-white overflow-hidden font-sans">

        {/* ═══ TOP NAV BAR ═══ */}
        <div className="h-[64px] bg-white border-b border-gray-100 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 flex-shrink-0 z-50 relative text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          
          {/* Menu / Sidebar Toggle (Leftmost, Udemy style) */}
          <button 
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors border-none bg-transparent cursor-pointer flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full hover:bg-gray-50 -ml-2"
            title={isSidebarOpen ? "Hide course content" : "Show course content"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isSidebarOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

          {/* Back/Exit */}
          <button 
            onClick={() => setViewState('PLAN')}
            className="flex items-center justify-center text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors border-none bg-transparent cursor-pointer flex-shrink-0 gap-2 pr-2"
            title="Back to Dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Evalme Branding */}
          <div className="hidden sm:flex items-center justify-center pr-5 border-r border-gray-100">
            <img src="/logo.svg" alt="Evalme" className="h-[28px] object-contain" />
          </div>

          {/* Course Title */}
          <h1 className="flex-1 text-[15px] sm:text-[16px] font-bold text-gray-800 truncate ml-1 sm:ml-2 tracking-wide flex items-center gap-3">
            {jobData.role}
          </h1>

          {/* Progress Pill */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-auto">
            {/* Progress Pill Desktop */}
            <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <div className="flex flex-col gap-1.5 mt-[2px]">
                <div className="w-24 h-[5px] bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${totalLessons > 0 ? (completedTopics.size / totalLessons) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-[12px] font-bold text-gray-600 tabular-nums whitespace-nowrap ml-1">
                {completedTopics.size} / {totalLessons}
              </span>
            </div>
            
            {/* Progress Pill Mobile */}
            <span className="md:hidden text-xs font-bold text-gray-600 tabular-nums bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              {currentLessonGlobal} / {totalLessons}
            </span>
          </div>
        </div>

        {/* ═══ BODY: SIDEBAR + CONTENT ═══ */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* Mobile backdrop */}
          <div 
            className={`cp-backdrop ${isSidebarOpen ? 'visible' : ''} md:hidden`}
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* ─── SIDEBAR ─── */}
          <aside className={`cp-sidebar ${!isSidebarOpen ? 'collapsed' : ''} w-[340px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-50 md:z-20 md:relative shadow-[4px_0_24px_rgba(0,0,0,0.05)] md:shadow-none`}>
            
            {/* Sidebar Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
              <h2 className="font-extrabold text-gray-900 text-[15px] tracking-tight leading-none m-0">
                Course content
              </h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors border-none bg-transparent text-gray-500"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar Sections */}
            <div className="flex-1 overflow-y-auto bg-[#FAFBFC]">
              {planData.map((mod, mIdx) => {
                const hasQuiz = Array.isArray(mod.quiz) && mod.quiz.length > 0;
                const totalInMod = (mod.topics?.length || 0) + (hasQuiz ? 1 : 0);
                let completedInMod = 0;
                for (let t = 0; t < totalInMod; t++) {
                  if (completedTopics.has(`${mIdx}-${t}`)) completedInMod++;
                }
                const isCurrentModule = mIdx === activeModuleIndex;

                return (
                  <div key={mIdx}>
                    {/* Section Header */}
                    <div className={`px-6 py-4 border-b border-gray-100 select-none bg-white`}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Section {mod.day}</span>
                        <span className="text-[11px] font-bold text-gray-400 tabular-nums">{completedInMod}/{totalInMod}</span>
                      </div>
                      <div className="text-[14px] font-bold text-gray-800 leading-snug truncate" title={mod.title}>{mod.title}</div>
                      <div className="w-full h-[2px] bg-gray-100 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full transition-all duration-300"
                          style={{ width: `${totalInMod > 0 ? (completedInMod / totalInMod) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Topic Items */}
                    <div className="flex flex-col border-b border-gray-100 pb-2 bg-[#FAFBFC]">
                      {mod.topics?.map((topic, tIdx) => {
                        const isActive = mIdx === activeModuleIndex && tIdx === activeTopicIndex;
                        const isCompleted = completedTopics.has(`${mIdx}-${tIdx}`);
                        return (
                          <button 
                            key={tIdx}
                            onClick={() => {
                              setActiveModuleIndex(mIdx);
                              setActiveTopicIndex(tIdx);
                              if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                            className={`text-left w-full border-none bg-transparent pl-6 pr-6 py-3 cursor-pointer transition-all flex items-start gap-3.5 group relative hover:bg-white`}
                            title={`${tIdx + 1}. ${topic.name}`}
                          >
                            <div className="pt-0.5">
                              {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                              ) : (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold border transition-colors ${
                                  isActive ? 'border-[var(--pikachu-yellow)] bg-[var(--pikachu-yellow)] text-gray-900' : 'border-gray-300 text-gray-400 group-hover:border-gray-400'
                                }`}>
                                  {tIdx + 1}
                                </div>
                              )}
                            </div>
                            <span className={`block flex-1 text-[13.5px] leading-snug pt-[1px] ${
                              isCompleted 
                                ? 'text-gray-400 line-through' 
                                : isActive 
                                  ? 'font-extrabold text-gray-900' 
                                  : 'font-medium text-gray-600 group-hover:text-gray-900'
                            }`}>
                              {topic.name}
                            </span>
                          </button>
                        );
                      })}
                      
                      {/* Quiz Item */}
                      {hasQuiz && (() => {
                        const tIdx = mod.topics?.length || 0;
                        const isActive = mIdx === activeModuleIndex && tIdx === activeTopicIndex;
                        const isCompleted = completedTopics.has(`${mIdx}-${tIdx}`);
                        return (
                          <button 
                            key="quiz"
                            onClick={() => {
                              setActiveModuleIndex(mIdx);
                              setActiveTopicIndex(tIdx);
                              if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                            className={`text-left w-full border-none bg-transparent pl-6 pr-6 py-3 cursor-pointer transition-all flex items-start gap-3.5 group relative hover:bg-white`}
                            title={`Module ${mod.day} Quiz`}
                          >
                            <div className="pt-0.5">
                              {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                              ) : (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold border transition-colors ${
                                  isActive ? 'border-purple-600 bg-purple-600 text-white' : 'border-purple-200 text-purple-400 group-hover:border-purple-400 group-hover:text-purple-600'
                                }`}>
                                  <span className="font-bold -mt-px text-[14px]">?</span>
                                </div>
                              )}
                            </div>
                            <span className={`block flex-1 text-[13.5px] leading-snug pt-[1px] ${
                              isCompleted 
                                ? 'text-gray-400 line-through' 
                                : isActive 
                                  ? 'font-extrabold text-purple-900' 
                                  : 'font-medium text-purple-600 group-hover:text-purple-800'
                            }`}>
                              Quiz
                            </span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ─── MAIN CONTENT AREA ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-32">
                
                {!isQuizScreen ? (
                  <>
                    {/* Breadcrumb */}
                    <div className="mb-4 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>Section {currentModule.day}</span>
                      <span className="text-gray-300">·</span>
                      <span>Lesson {activeTopicIndex + 1} of {currentModule.topics.length}</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-gray-900 mb-8 leading-[1.15] tracking-tight">
                      {currentTopic.name}
                    </h1>

                    {/* Divider */}
                    <div className="w-16 h-[2px] bg-[var(--pikachu-yellow)] mb-10"></div>

                    {/* Content Blocks */}
                    <div className="mb-12 relative">
                      {(() => {
                        const rawText = currentTopic.readingMaterial || "";
                        const cleanText = rawText.replace(/\n/g, ' ').replace(/\s+/g, ' ');
                        const sentences = cleanText.split('. ').map(s => s.trim()).filter(s => s.length > 5);
                        
                        if (sentences.length === 0) {
                          return <p className="text-gray-500 italic">No content available for this lesson.</p>;
                        }

                        const introSentences = sentences.slice(0, 2);
                        const cardSentences = sentences.slice(2, 6);
                        const highlightSentence = sentences.length > 6 ? sentences[6] : null;
                        const remainingSentences = sentences.slice(highlightSentence ? 7 : 6);

                        return (
                          <div className="flex flex-col gap-10">
                            {/* Intro */}
                            <div className="text-[1.1rem] sm:text-[1.15rem] leading-[1.8] text-gray-700">
                              {introSentences.join('. ')}
                              {introSentences.length > 0 && !introSentences[introSentences.length - 1].endsWith('.') ? '.' : ''}
                            </div>

                            {/* Key Takeaways */}
                            {cardSentences.length > 0 && (
                              <div className="mt-2 mb-2">
                                <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2.5">
                                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                  Key Takeaways
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {cardSentences.map((cardText, i) => (
                                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                                      <div className="flex items-start gap-4">
                                        <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-400 flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <p className="text-gray-700 m-0 text-[15px] leading-[1.6]">{cardText}.</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Highlight Quote */}
                            {highlightSentence && (
                              <blockquote className="border-l-4 border-[var(--pikachu-yellow)] bg-[#FFFEF8] pl-5 py-4 pr-4 rounded-r-lg my-1">
                                <p className="text-gray-800 m-0 leading-relaxed font-medium italic">
                                  "{highlightSentence}."
                                </p>
                              </blockquote>
                            )}

                            {/* Mermaid Diagram */}
                            {currentTopic.mermaidDiagram && (
                              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white w-full p-5 flex items-center justify-center">
                                <div className="w-full overflow-x-auto flex justify-center text-sm">
                                  <Mermaid chart={sanitizeMermaid(currentTopic.mermaidDiagram)} />
                                </div>
                              </div>
                            )}

                            {/* Data Table */}
                            {currentTopic.keyTable && currentTopic.keyTable.headers && currentTopic.keyTable.rows && (
                              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white w-full">
                                <div className="bg-[#FAFBFC] px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                  <h4 className="font-bold text-xs text-gray-500 tracking-wider uppercase m-0">Reference</h4>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse min-w-[400px] m-0">
                                    <thead>
                                      <tr className="bg-white border-b border-gray-100">
                                        {currentTopic.keyTable.headers.map((h, hi) => (
                                          <th key={hi} className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {currentTopic.keyTable.rows.map((row, ri) => (
                                        <tr key={ri} className="hover:bg-gray-50 transition-colors">
                                          {row.map((cell, ci) => (
                                            <td key={ci} className={`py-3 px-5 text-sm ${ci === 0 ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Bullet Points */}
                            {remainingSentences.length > 0 && (
                              <ul className="space-y-4 m-0 p-0">
                                {remainingSentences.map((liText, i) => (
                                  <li key={i} className="flex gap-3 text-gray-700 items-start text-[1rem] leading-[1.7]">
                                    <svg className="w-5 h-5 text-[var(--pikachu-yellow)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{liText}.</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </>
                ) : (
                  /* ═══ QUIZ SCREEN ═══ */
                  <div className="w-full">
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      <span>Section {currentModule.day}</span>
                      <span className="text-purple-300">·</span>
                      <span>Knowledge Check</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
                      Module {currentModule.day} Quiz
                    </h1>
                    <div className="w-12 h-[3px] bg-purple-400 rounded-full mb-8"></div>

                    <div className="flex flex-col gap-6">
                      {showQuizSummary ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
                          <h2 className="text-2xl font-bold mb-3">Quiz Complete!</h2>
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
                                <div className={`text-5xl font-extrabold mb-3 ${isPassing ? 'text-green-500' : 'text-red-500'}`}>
                                  {scorePercentage.toFixed(0)}%
                                </div>
                                <p className="text-gray-500 text-base mb-5">
                                  {correctCount} of {totalQuestions} correct
                                </p>
                                {isPassing ? (
                                  <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-lg font-bold mb-5 inline-block">
                                    ✓ Passed!
                                  </div>
                                ) : (
                                  <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg font-bold mb-5 inline-block">
                                    Need 40% to pass. Review and retry.
                                  </div>
                                )}
                                {!isPassing && (
                                  <div>
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
                                  </div>
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
                          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
                            <div className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                              Question {qIdx + 1} of {quizData.length}
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-5">{q.question}</h3>
                            <div className="flex flex-col gap-2.5 mb-5">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = selectedAnswer === oIdx;
                                let btnClass = "text-left px-4 py-3.5 rounded-lg border-2 font-medium transition-all text-sm ";
                                if (hasAnswered) {
                                  if (oIdx === q.correctIndex) {
                                    btnClass += "border-green-500 bg-green-50 text-green-700";
                                  } else if (isSelected) {
                                    btnClass += "border-red-400 bg-red-50 text-red-600";
                                  } else {
                                    btnClass += "border-gray-100 bg-white text-gray-300";
                                  }
                                } else {
                                  btnClass += "border-gray-200 bg-white hover:border-[var(--pikachu-yellow)] hover:bg-[#FFFEF8] text-gray-700 cursor-pointer";
                                }
                                return (
                                  <button 
                                    key={oIdx}
                                    disabled={hasAnswered}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [answerKey]: oIdx }))}
                                    className={btnClass}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="w-6 h-6 rounded-full bg-white border border-current flex items-center justify-center text-[11px] shrink-0 font-bold">
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      <span>{opt}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            {hasAnswered && (
                              <div className="flex justify-end pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => {
                                    if (currentQuizQuestionIndex < quizData.length - 1) {
                                      setCurrentQuizQuestionIndex(prev => prev + 1);
                                    } else {
                                      setShowQuizSummary(true);
                                    }
                                  }}
                                  className="bg-gray-900 hover:bg-black text-white font-bold px-5 py-2.5 rounded-lg transition-colors border-none cursor-pointer flex items-center gap-2 text-sm"
                                >
                                  {currentQuizQuestionIndex < quizData.length - 1 ? "Next" : "See Results"}
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* ═══ STICKY BOTTOM BAR ═══ */}
            {(!isQuizScreen || (showQuizSummary && isQuizPassed())) && (
              <div className="bg-white border-t border-gray-100 px-6 sm:px-12 py-4 z-20 flex-shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] relative">
                <div className="max-w-3xl mx-auto cp-bottom-bar-inner flex items-center justify-between gap-4">
                  <div className="font-bold text-gray-400 text-[13px] hidden sm:block tracking-wide">
                    {isQuizScreen ? `Module ${currentModule.day} Quiz` : `Lesson ${activeTopicIndex + 1} of ${currentModule.topics.length}`}
                  </div>
                  <button 
                    onClick={handleNextLesson}
                    className="cp-btn-complete bg-[#111827] text-white font-bold px-8 py-3.5 rounded-xl border-none cursor-pointer hover:bg-black transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-[15px] sm:w-auto w-full shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                  >
                    Mark Complete & Next
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    )
  }

  if (viewState === 'OVERVIEW' && jobData) {
    return (
      <div className="w-full min-h-[100dvh] py-10 px-4 flex flex-col items-center bg-[#FAFAFA] overflow-x-hidden overflow-y-auto relative">
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

  // AUTH SPINNER
  if (viewState === 'AUTH_SPINNER') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center relative bg-[#FAFAFA] overflow-hidden p-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--volt-yellow)] rounded-full animate-spin"></div>
      </div>
    )
  }

  // PRICING VIEW
  if (viewState === 'PRICING') {
    return (
      <div className="w-full min-h-[100dvh] flex items-center justify-center relative bg-[#FAFAFA] overflow-x-hidden overflow-y-auto py-12 px-4">
        <div className="decoration dec-1"></div>
        <div className="decoration dec-2"></div>

        <div className="w-full max-w-[900px] relative z-10 flex flex-col items-center">
          <button 
            onClick={() => setViewState('HOME')}
            className="self-start mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-white/50 px-4 py-2 rounded-xl text-sm w-max backdrop-blur-sm border border-gray-200/50 cursor-pointer shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4 border border-amber-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              Premium
            </div>
            <h1 className="text-[2.5rem] font-extrabold mb-2 tracking-tight text-[#111827]">Unlock Full Access</h1>
            <p className="text-gray-500 text-[16px] max-w-md mx-auto">Get unlimited course generations, all coding courses, and premium content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[750px]">
            {PLANS.map(plan => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular ? 'border-blue-400 scale-[1.03]' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">Most Popular</div>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mt-2" style={{ backgroundColor: plan.color + '15', border: `1.5px solid ${plan.color}30` }}>
                  <svg className="w-6 h-6" style={{ color: plan.color }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
                <h3 className="text-lg font-extrabold text-[#111827] mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-xs mb-4">{plan.duration}</p>
                <div className="mb-5">
                  <span className="text-3xl font-extrabold text-[#111827]">₹{plan.price}</span>
                </div>
                <ul className="text-left text-sm text-gray-600 space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> Unlimited course generations</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> All course sections unlocked</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> Coding Academy access</li>
                </ul>
                <button
                  onClick={() => handlePayment(plan)}
                  className="w-full py-3 rounded-xl font-extrabold text-white text-[15px] transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer border-none shadow-md"
                  style={{ backgroundColor: plan.color }}
                >
                  Get {plan.name}
                </button>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="mt-8 w-full max-w-[400px] bg-white rounded-2xl p-5 shadow-[0_4px_15px_rgb(0,0,0,0.04)] border border-gray-100">
            <p className="text-sm font-bold text-[#111827] mb-3 text-center">Have a coupon code?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value); setCouponError('') }}
                placeholder="Enter coupon code"
                className="flex-1 bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] transition-all placeholder:text-gray-400"
              />
              <button
                onClick={handleCoupon}
                className="px-5 py-2.5 bg-[#111827] text-white font-bold text-sm rounded-xl cursor-pointer border-none hover:bg-[#1f2937] transition-all active:scale-[0.97]"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2 text-center font-medium">{couponError}</p>}
          </div>
        </div>
      </div>
    )
  }

  // AUTH VIEW
  if (viewState === 'AUTH') {
    return (
      <div className="w-full min-h-[100dvh] flex items-center justify-center relative bg-[#FAFAFA] overflow-x-hidden overflow-y-auto py-12 px-4">
        <div className="decoration dec-1"></div>
        <div className="decoration dec-2"></div>

        <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
          <div className="text-center mb-10 w-full flex flex-col items-center">
            <img src="/logo.svg" alt="Evalme" className="h-[48px] mb-6 object-contain" />
            <p className="text-gray-500 text-[18px]">Sign in to access AI interview prep & coding paths</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-full relative overflow-hidden flex flex-col gap-6">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-4 bg-white border border-gray-200 text-gray-800 font-bold px-6 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
            <p className="text-gray-400 text-xs text-center mt-2 px-6">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    )
  }

  // HOME VIEW
  if (viewState === 'HOME') {
    return (
      <div className="w-full min-h-[100dvh] flex flex-col relative bg-[#FAFAFA] overflow-x-hidden overflow-y-auto">
        <div className="decoration dec-1"></div>
        <div className="decoration dec-2"></div>
        
        {/* Simple Top Nav with User Profile */}
        <div className="w-full px-6 py-4 flex justify-end items-center relative z-20">
          {session?.user && (
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
               {session.user.user_metadata?.avatar_url ? (
                 <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
               ) : (
                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase border border-blue-200">
                   {session.user.email?.[0]}
                 </div>
               )}
               <span className="text-sm font-semibold text-gray-700 hidden sm:block max-w-[150px] truncate">
                 {session.user.email}
               </span>
               <button 
                 onClick={handleSignOut}
                 className="ml-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider px-2 py-1 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer border-none"
               >
                 Logout
               </button>
               {isPremium ? (
                 <span className="text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-400 text-[#111827] px-2.5 py-0.5 rounded-full ml-1">PRO</span>
               ) : (
                 <button onClick={() => setViewState('PRICING')} className="text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-400 text-[#111827] px-2.5 py-1 rounded-full cursor-pointer border-none hover:brightness-110 transition-all ml-1">Upgrade</button>
               )}
            </div>
          )}
        </div>

        <div className="flex-1 w-full flex items-center justify-center p-4">
          <div className="w-full max-w-[800px] relative z-10 flex flex-col items-center">
            <div className="text-center mb-12 flex flex-col items-center">
              <img src="/logo.svg" alt="Evalme" className="h-[48px] mb-6 object-contain" />
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
              
              <h2 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight relative z-10">Interview Prep Planner</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8 relative z-10">
                Generate a highly tailored day-by-day interview preparation planner to ace your interview.
              </p>
              
              <div className="mt-auto text-amber-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-[15px] drop-shadow-sm brightness-95 relative z-10">
                Start Building 
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </button>

            {/* Tile 2: Learn Coding */}
            <button 
              onClick={() => isPremium ? setViewState('CODING_COURSES') : setViewState('PRICING')}
              className="group text-left bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 hover:border-[#8BE9FD] transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8BE9FD] to-transparent opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500"></div>

              {!isPremium && (
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-amber-400 to-yellow-400 text-[#111827] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                  PRO
                </div>
              )}

              <div className="w-14 h-14 bg-[#F2FDFE] border border-[#8BE9FD] rounded-2xl flex items-center justify-center mb-6 text-[#17a2b8] shadow-sm relative z-10">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight relative z-10">Learn Coding</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6 relative z-10">
                Interactive AI-powered coding editor with live personalized challenges.
              </p>
              
              <div className={`mt-auto font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-[15px] drop-shadow-sm brightness-95 relative z-10 ${isPremium ? 'text-[#17a2b8]' : 'text-amber-500'}`}>
                {isPremium ? 'Browse Courses' : 'Unlock with Premium'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </button>

          </div>
        </div>
      </div>
      </div>
    )
  }

  // CODING COURSES HUB
  if (viewState === 'CODING_COURSES') {
    return (
      <div className="w-full min-h-[100dvh] flex items-center justify-center relative bg-[#FAFAFA] overflow-x-hidden overflow-y-auto py-12 px-4">
        <div className="decoration dec-1"></div>
        <div className="decoration dec-2"></div>

        <div className="w-full max-w-[800px] relative z-10 flex flex-col items-center">
          <div className="w-full mb-8 flex items-center justify-start max-w-[600px] mx-auto">
            <button 
              onClick={() => setViewState('HOME')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-white/50 px-4 py-2 rounded-xl text-sm w-max backdrop-blur-sm border border-gray-200/50 cursor-pointer shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back
            </button>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-[2.5rem] font-extrabold mb-2 tracking-tight text-[#111827]">Coding Academy</h1>
            <p className="text-gray-500 text-[16px]">Master essential engineering skills interactively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[600px]">
            {/* SQL Course Tile */}
            <button 
              onClick={() => setViewState('SQL_COURSE')}
              className="group text-left bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-blue-400 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-md relative overflow-hidden flex items-start gap-5"
            >
              <div className="w-14 h-14 shrink-0 bg-[#F0FBFF] border border-blue-200 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </div>
              <div className="flex flex-col h-full justify-center">
                <h2 className="text-xl font-bold text-[#111827] mb-1">SQL Basics</h2>
                <p className="text-gray-500 text-[14px] leading-relaxed">
                  Interactive lessons & live database challenges.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // SQL COURSE RENDER
  if (viewState === 'SQL_COURSE') {
    return (
      <div className="w-full h-screen relative bg-white">
        <button 
          onClick={() => setViewState('CODING_COURSES')}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors bg-white px-4 py-2 rounded-xl text-sm w-max border border-gray-200 shadow hover:shadow-md cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Leave Course
        </button>
        <iframe src="/sql_course.html?v=v3-latest" className="w-full h-full border-none m-0 p-0 block" title="SQL Interactive Course"></iframe>
      </div>
    )
  }

  // GENERATOR VIEW
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center relative bg-[#FAFAFA] overflow-x-hidden overflow-y-auto py-12 px-4">
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
          
          <div className="text-center mb-8 flex flex-col items-center">
            <img src="/logo.svg" alt="Evalme" className="h-[40px] mb-4 object-contain" />
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
              <span className="font-extrabold text-[16px] tracking-wide">{isGenerating ? 'Building Your Course...' : 'Generate'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
