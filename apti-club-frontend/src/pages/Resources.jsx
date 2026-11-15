import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Target,
  Lightbulb,
  RotateCcw,
  BookOpenText,
  Brain,
  Sparkles,
  Rocket,
  TimerReset,
  BriefcaseBusiness,
  BarChart3,
  MessageSquareText,
  PenTool,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ResourceCard from '../components/ResourceCard'
import aptitudeBg from '../assets/aptitude-bg.png'
import personalityBg from '../assets/personality-bg.png'
import interviewBg from '../assets/interview-bg.png'
import dsaBg from '../assets/dsa-bg.png'
import resumeBg from '../assets/resume-bg.png'

const categories = [
  {
    name: 'Aptitude',
    slug: 'aptitude',
    description: 'Master quantitative aptitude, logical reasoning and verbal ability.',
  },
  {
    name: 'Personality & Communication',
    slug: 'personality',
    description: 'Sharpen your presence, confidence and communication for interviews and teams.',
  },
  {
    name: 'Interview Preparation',
    slug: 'interview',
    description: 'Prepare for HR interviews, technical rounds and group discussions.',
  },
  {
    name: 'Data Structures & Algorithms',
    slug: 'dsa',
    description: 'Improve your coding skills and problem-solving techniques.',
  },
  {
    name: 'Resume Building',
    slug: 'resume',
    description: 'Build an impressive, ATS-friendly resume that gets noticed.',
  }
]

const guides = {
  aptitude: {
    intro: 'Aptitude tests check how quickly and accurately you can solve unfamiliar problems. The secret is not memorising formulas — it is practising regularly.',
    goal: 'Build speed, accuracy and confidence for company assessment tests.',
    flashcards: [
      { front: 'Quantitative Aptitude', back: 'Covers percentages, profit & loss, time & work, probability and number systems. Focus on shortcuts and mental math tricks to cut down time per question.' },
      { front: 'Logical Reasoning', back: 'Puzzles, coding-decoding, blood relations, directions and number series. Learn to identify patterns quickly rather than re-reading the question.' },
      { front: 'Verbal Ability', back: 'Grammar rules, vocabulary in context, reading comprehension and para jumbles. Read one article daily to build intuition for sentence structure.' },
      { front: 'Gamified Assessments', back: 'Memory, attention, pattern recognition and reaction time tests used by MNCs. These cannot be crammed — only consistent daily practice improves scores.' },
      { front: 'Mock Test Strategy', back: 'Attempt full-length timed mocks only after topic-wise preparation. Analyse wrong answers more carefully than correct ones — mistakes reveal your gaps.' },
    ],
    steps: [
      { label: 'Learn Concepts', desc: 'Start with basic formulas and understand the why behind each.', icon: 'book' },
      { label: 'Topic-wise Practice', desc: 'Solve questions per topic before mixing them up.', icon: 'chart' },
      { label: 'Timed Quizzes', desc: 'Set a timer. Speed only comes from repeated pressure.', icon: 'timer' },
      { label: 'Review Mistakes', desc: 'Every wrong answer is a free lesson — read the solution carefully.', icon: 'spark' },
      { label: 'Full Mock Tests', desc: 'Simulate company assessments with realistic conditions.', icon: 'rocket' },
    ],
    tip: 'Take the Bizotic weekly assesments without fail, it actually helps. Solve 10–15 questions every day. Track your accuracy percentage, not just question count.',
    links: [
      { name: 'IndiaBix', url: 'https://www.indiabix.com', desc: 'The go-to for aptitude MCQs with detailed solutions. Covers every topic from basic to advanced with company-specific question sets.', tag: 'Practice' },
      { name: 'PrepInsta', url: 'https://prepinsta.com', desc: 'Company-specific aptitude papers, dashboards and timed mock tests. Especially useful once you know which companies you are targeting.', tag: 'Company Prep' },
      { name: 'MockPrep', url: 'https://www.mockprep.co.in/gate-mock-tests/general-aptitude', desc: 'Full-length adaptive mock tests with analytics. Good for identifying weak areas and tracking improvement over time.', tag: 'Mock Tests' },
      { name: 'SelfStudy', url: 'https://www.selfstudys.com/mcq/gate/online/mock-test/general-aptitude', desc: 'Provide multiple timed 20-minute sectional mock tests.', tag: 'Mock Tests' },
      { name: 'TCYonline', url: 'https://www.tcyonline.com/tests/aptitude-test-for-gate', desc: 'Topic-wise and mixed numerical aptitude practice series with customizable time limits and difficulty levels.', tag: 'Mock Tests'},
      { name: 'MindTree Aptitude Papers', url: 'https://www.m4maths.com', desc: 'Real placement papers from top companies with difficulty ratings. Filter by company name and practice the exact question types they use.', tag: 'Placement Papers' },
    ],
  },
  personality: {
    intro: 'Your communication, confidence and how you carry yourself shape first impressions as much as your technical skills do. Build presence, not just knowledge.',
    goal: 'Become more confident, expressive and natural in interviews, teamwork and presentations.',
    flashcards: [
      { front: 'Self-Introduction', back: 'Your intro should sound polished but natural. Keep it concise, structured and tailored to the role you want.' },
      { front: 'Communication Skills', back: 'Speak clearly, pause before answering, and explain your thinking step by step. Good communication helps interviewers trust your judgment.' },
      { front: 'Confidence & Presence', back: 'Sit upright, maintain eye contact, smile when appropriate and keep your pace steady. Energy and clarity are often noticed before your answer is even judged.' },
      { front: 'Team Fit', back: 'Strong personalities are collaborative, respectful and active listeners. Employers value people who can contribute without dominating the room.' },
      { front: 'Storytelling', back: 'Rehearse your real achievements in a narrative form: challenge, action, result. Storytelling makes your experience memorable and credible.' },
    ],
    steps: [
      { label: 'Build Your Voice', desc: 'Define your strengths, values and the kind of impression you want to leave.', icon: 'users' },
      { label: 'Prepare Stories', desc: 'Collect 3–5 real examples from classes, projects, teams and challenges.', icon: 'message' },
      { label: 'Polish Delivery', desc: 'Practice speaking slowly, clearly and confidently in front of a mirror or friend.', icon: 'spark' },
      { label: 'Improve Presence', desc: 'Work on posture, tone, eye contact and calm breathing during discussions.', icon: 'briefcase' },
      { label: 'Mock Interaction', desc: 'Run short conversations and intro sessions with feedback until they feel natural.', icon: 'check' },
    ],
    tip: 'Confidence is not perfection. It is clarity, composure and honesty under pressure.',
    links: [
      { name: 'Toastmasters', url: 'https://www.toastmasters.org', desc: 'A structured way to improve presentation, confidence and speaking in a practical environment.', tag: 'Public Speaking' },
      { name: 'TED Talks', url: 'https://www.ted.com/talks', desc: 'Great examples of confidence, storytelling and concise communication.', tag: 'Speech Skills' },
      { name: 'LinkedIn Learning: Communication', url: 'https://www.linkedin.com/learning', desc: 'Short modules on interpersonal communication, active listening and presentation.', tag: 'Skill Growth' },
      { name: 'The Muse Career Advice', url: 'https://www.themuse.com/advice', desc: 'Practical advice on interviews, networking and professionalism.', tag: 'Career' },
      { name: 'HBR on Communication Skills', url: 'https://hbr.org', desc: 'Professional communication strategies used by managers and leaders.', tag: 'Leadership' },
      { name: 'Practice with a Peer', url: '#', desc: 'Use your friends or club members for short mock conversations and honest feedback.', tag: 'Feedback' },
    ],
  },
  interview: {
    intro: 'Recruiters want to understand how you think, communicate, solve problems and work with others. An interview is your chance to show more than what is written on your resume.',
    goal: 'Become confident in technical discussions, HR rounds and real interview situations.',
    flashcards: [
      { front: 'Technical Interviews', back: 'Covers programming, DSA, OOP, DBMS, OS and computer networks. Revise concepts from your subjects and be ready to code on the spot — clarity of thought matters as much as the answer.' },
      { front: 'HR Round Questions', back: '"Tell me about yourself", strengths, weaknesses and career goals. Prepare structured 60-second answers. Authenticity beats rehearsed-sounding perfection.' },
      { front: 'Behavioural Questions', back: 'Use STAR: Situation, Task, Action, Result. Prepare 5–6 real experiences from college projects, internships or club activities that you can adapt to different questions.' },
      { front: 'Company Research', back: 'Know the company\'s products, work culture, technologies and what the specific role does. Interviewers notice when candidates have done homework — it separates you from the crowd.' },
      { front: 'Virtual Interview Etiquette', back: 'Test your camera, mic and internet 15 minutes before. Dress professionally, choose a clean background, maintain eye contact through the camera lens, not the screen.' },
    ],
    steps: [
      { label: 'Build Your Intro', desc: 'Craft a 60–90 second introduction that covers who you are, what you have done and what you want.', icon: 'pen' },
      { label: 'Revise Your Resume', desc: 'Know every line of your resume — projects, skills and achievements inside out.', icon: 'file' },
      { label: 'Prep HR Answers', desc: 'Write out answers for common HR and behavioural questions using STAR.', icon: 'message' },
      { label: 'Research the Company', desc: 'Read about the company, role and recent news before every interview.', icon: 'briefcase' },
      { label: 'Mock Interviews', desc: 'Record yourself or practice with a peer and iterate on your answers.', icon: 'check' },
    ],
    tip: 'Structure behavioural answers with STAR. Always use real examples — interviewers can tell when a story is invented.',
    links: [
      { name: 'Glassdoor Interview Questions', url: 'https://www.glassdoor.co.in/Interview/index.htm', desc: 'Real interview questions shared by candidates who have been through the process at specific companies. Filter by company and role for hyper-relevant prep.', tag: 'Company Specific' },
      { name: 'LeetCode Discuss', url: 'https://leetcode.com/discuss/interview-question', desc: 'Technical interview questions tagged by company and difficulty, with community solutions and discussions. Invaluable for SDE roles at product companies.', tag: 'Technical' },
      { name: 'Big Interview', url: 'https://biginterview.com', desc: 'Structured video practice for HR and behavioural rounds with AI-powered feedback on your answers. Builds confidence before the real thing.', tag: 'Mock Interviews' },
      { name: 'InterviewBit', url: 'https://www.interviewbit.com', desc: 'Company-wise structured learning paths covering both coding and core CS subjects. Has a built-in mock interview platform with real engineers.', tag: 'Full Prep' },
      { name: 'AmbitionBox', url: 'https://www.ambitionbox.com', desc: 'Indian company reviews, interview experiences and salary insights shared by employees. Great for understanding what to expect company-specifically.', tag: 'Indian Companies' },
      { name: 'The Muse — Interview Coach', url: 'https://www.themuse.com/advice/interview-questions-and-answers', desc: 'Expert-written guides on answering every type of HR question with example answers. Covers everything from "tell me about yourself" to salary negotiation.', tag: 'HR Prep' },
    ],
  },
  dsa: {
    intro: 'Data Structures and Algorithms help you write efficient solutions, break down complex problems and explain your thought process clearly under pressure.',
    goal: 'Move from basic coding to solving interview-level problems confidently.',
    flashcards: [
      { front: 'Arrays & Strings', back: 'Foundation of almost every problem. Master in-place operations, two-pointer technique, prefix sums and sliding window before moving to other structures.' },
      { front: 'Linked Lists, Stacks & Queues', back: 'Understand pointer manipulation thoroughly. Common interview asks: reverse a linked list, detect cycles, implement a stack using queues, evaluate expressions.' },
      { front: 'Trees & Graphs', back: 'Trees appear in 30%+ of interviews. Learn inorder/preorder/postorder traversal, BFS, DFS, lowest common ancestor and shortest path algorithms (Dijkstra, BFS).' },
      { front: 'Hashing & Frequency Maps', back: 'HashMap and HashSet reduce O(n²) solutions to O(n) in many problems. Practice frequency counting, two-sum variants and grouping anagrams.' },
      { front: 'Dynamic Programming', back: 'Start with the classic problems: fibonacci, 0/1 knapsack, longest common subsequence. Identify if a problem has overlapping subproblems + optimal substructure, then write the recurrence first.' },
    ],
    steps: [
      { label: 'Pick a Language', desc: 'Choose one — Python, Java or C++ — and get comfortable with its syntax and built-in structures.', icon: 'brain' },
      { label: 'One Topic at a Time', desc: 'Go deep on each data structure before switching. Breadth without depth leads to surface-level knowledge.', icon: 'book' },
      { label: 'Visual Learning', desc: 'Use visualgo.net or CS50 animations to watch algorithms run step by step.', icon: 'spark' },
      { label: 'Solve & Submit', desc: 'Start with Easy problems, understand editorial solutions, then attempt Medium.', icon: 'chart' },
      { label: 'Timed Practice', desc: 'Set a 30-minute timer per problem. Simulate real contest pressure.', icon: 'timer' },
    ],
    tip: 'Never jump to hard problems. Understand brute force first, then ask: can I do this in less space or fewer passes?',
    links: [
      { name: 'LeetCode', url: 'https://leetcode.com', desc: 'The industry standard for coding interview prep with 2500+ problems tagged by company, topic and difficulty. Start with the Blind 75 list for maximum efficiency.', tag: 'Practice' },
      { name: 'Striver\'s DSA Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', desc: 'A structured 450-problem roadmap covering every DSA topic from scratch to advanced. Widely used by Indian engineering students targeting product companies.', tag: 'Structured Roadmap' },
      { name: 'NeetCode.io', url: 'https://neetcode.io', desc: 'Free video solutions for the most important LeetCode problems, with clear pattern-based explanations. Grouped by technique, not just topic.', tag: 'Video Solutions' },
      { name: 'Codeforces', url: 'https://codeforces.com', desc: 'Competitive programming contests that sharpen speed and problem-solving intuition. Regular participation builds the mental stamina for coding rounds.', tag: 'Competitive' },
      { name: 'VisuAlgo', url: 'https://visualgo.net', desc: 'Animated step-by-step visualisations of every major algorithm and data structure. Essential for building accurate mental models before writing code.', tag: 'Visual Learning' },
      { name: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures', desc: 'Comprehensive written explanations with code in multiple languages. Best used as a reference when you need to understand theory or see examples quickly.', tag: 'Reference' },
    ],
  },
  resume: {
    intro: 'Your resume is often the first impression a recruiter gets of you. It needs to communicate your skills, projects and achievements clearly — not impress with design.',
    goal: 'Create a professional, ATS-friendly resume that highlights your strengths and matches the role you want.',
    flashcards: [
      { front: 'ATS Compatibility', back: 'Applicant Tracking Systems scan resumes before a human ever reads them. Use standard section headings, avoid tables and graphics, and stick to a single-column layout to ensure clean parsing.' },
      { front: 'Projects Section', back: 'Each project should answer: what problem did it solve, what technologies did you use, and what was the measurable outcome? Use bullet points with numbers wherever possible.' },
      { front: 'Action Verbs & Metrics', back: 'Replace "worked on" with "built", "designed", "reduced", "improved". Wherever possible, add a number: "reduced API response time by 40%" is far stronger than "improved performance".' },
      { front: 'Technical Skills', back: 'List only skills you can actually discuss in an interview. Group them by category (Languages, Frameworks, Tools). Never pad this section — interviewers will probe everything listed here.' },
      { front: 'One Page Rule', back: 'As a student or fresher, one page is non-negotiable. Every bullet must earn its place. If a point does not add new information, cut it. Tight writing shows strong thinking.' },
    ],
    steps: [
      { label: 'Choose a Template', desc: 'Use Jake\'s Resume or Overleaf templates — clean, ATS-safe, and professional.', icon: 'book' },
      { label: 'Fill Education & Skills', desc: 'List your degree, CGPA (if above 7.5), and genuinely known technical skills.', icon: 'check' },
      { label: 'Write Your Projects', desc: 'Two to three projects with clear tech stack, your contribution and measurable outcome.', icon: 'briefcase' },
      { label: 'Add Achievements', desc: 'Certifications, hackathon placements, open-source contributions and academic awards.', icon: 'spark' },
      { label: 'Proofread & Export', desc: 'Read aloud to catch errors. Export as PDF — always, never .docx.', icon: 'rocket' },
    ],
    tip: 'Never add a skill just to fill space. If it is on your resume, you must be able to code it, explain it or demo it in the interview.',
    links: [
  {
    name: 'Harvard - Resume Guide',
    url: 'https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/',
    desc: 'A detailed guide from Harvard on creating a clear, professional resume. Learn how to organise your sections, write strong bullet points, highlight achievements and present your experience effectively.',
    tag: 'Guide'
  },
  {
    name: 'The Muse - Resume Examples',
    url: 'https://www.themuse.com/advice/resume-examples',
    desc: 'Explore resume examples for different industries, experience levels and job roles. Get ideas for presenting your skills, work experience and achievements in a recruiter-friendly format.',
    tag: 'Examples'
  },
  {
    name: 'Resume Worded',
    url: 'https://resumeworded.com',
    desc: 'AI-powered resume scanner that scores your resume against ATS systems and gives specific improvement suggestions. Run your resume here before submitting to any company.',
    tag: 'ATS Checker'
  },
  {
    name: 'LinkedIn Profile Guide',
    url: 'https://www.linkedin.com/help/linkedin/answer/112133',
    desc: 'Official guide for building a complete LinkedIn profile that gets discovered by recruiters. Your LinkedIn and resume should tell the same story, consistently.',
    tag: 'Guide'
  },
  {
    name: 'Google Docs',
    url: 'https://docs.google.com/document/d/14ek9vTrW5VNeAZKYC3ia6KPdUhqbi7FpKMS-yY5Ix-g/edit?tab=t.0',
    desc: 'A ready-to-edit Google Docs resume document. Use it to organise your education, skills, projects and achievements, then customise the content to match the roles you are applying for.',
    tag: 'Template'
  },
  {
    name: 'Overleaf',
    url: 'https://www.overleaf.com/latex/templates/tagged/cv',
    desc: 'Browse professional LaTeX CV and resume templates. Customise the layout, organise your sections and generate a polished PDF. Check that your chosen template is compatible with ATS systems.',
    tag: 'Template'
  },
  ],
  },
}

const themes = {
  aptitude: {
    bg: '#0f172a',
    accent: '#7dd3fc',
    accentDim: 'rgba(125, 211, 252, 0.16)',
    glow: 'rgba(125, 211, 252, 0.22)',
    label: 'Aptitude',
    backgroundImage: `url(${aptitudeBg})`
  },
  personality: {
    bg: '#1b1a18',
    accent: '#f4a261',
    accentDim: 'rgba(244, 162, 97, 0.18)',
    glow: 'rgba(244, 162, 97, 0.18)',
    label: 'Personality',
    backgroundImage: `url(${personalityBg})`
  },
  interview: {
    bg: '#111827',
    accent: '#fbbf24',
    accentDim: 'rgba(251, 191, 36, 0.14)',
    glow: 'rgba(251, 191, 36, 0.18)',
    label: 'Interview Prep',
    backgroundImage: `url(${interviewBg})`
  },
  dsa: {
    bg: '#0f172a',
    accent: '#a78bfa',
    accentDim: 'rgba(167, 139, 250, 0.16)',
    glow: 'rgba(167, 139, 250, 0.18)',
    label: 'DSA',
    backgroundImage: `url(${dsaBg})`
  },
  resume: {
    bg: '#111827',
    accent: '#fb7185',
    accentDim: 'rgba(251, 113, 133, 0.14)',
    glow: 'rgba(251, 113, 133, 0.2)',
    label: 'Resume Building',
    backgroundImage: `url(${resumeBg})`
  }
}

const stepIcons = {
  book: BookOpenText,
  brain: Brain,
  spark: Sparkles,
  rocket: Rocket,
  timer: TimerReset,
  briefcase: BriefcaseBusiness,
  chart: BarChart3,
  message: MessageSquareText,
  pen: PenTool,
  check: CheckCircle2,
  trend: TrendingUp,
  users: Users,
  file: BookOpenText,
}

const roadmapDetails = {
  aptitude: [
    'Begin with the ideas and formulas behind percentages, ratios, averages, time and work, and basic reasoning. Work through examples slowly and explain why each step is valid before learning shortcuts. Keep a compact formula sheet and note the concepts that need another review.',
    'Choose one topic at a time and solve questions that gradually increase in difficulty. Review correct and incorrect answers to identify patterns, careless errors, and gaps in understanding. Move to mixed practice when you can handle the fundamentals accurately without hints.',
    'Add a realistic time limit to short quizzes once your accuracy is steady. Practise deciding when to continue, skip, or return to a question, and record both time and accuracy. Increase pressure gradually; the goal is to become calm and efficient, not simply to rush.',
    'Keep a mistake log with the question type, what led to the error, and the method that solves it correctly. Rework each missed question without looking at the solution, then try a similar one later. This turns practice into targeted learning and prevents the same gaps from recurring.',
    'Take full placement-style mocks in one uninterrupted sitting, using realistic time limits and section order. Review your score by topic, identify where time was lost, and choose specific improvements for the next attempt. Finish with another mock to see whether accuracy and pacing improved.',
  ],
  personality: [
    'Identify the strengths, interests, and values you want people to remember about you. Write honest notes about projects and situations that show those qualities, then shape them into a short introduction in your own words. Aim for a genuine first impression rather than an imitation of a script.',
    'Collect three to five real examples from coursework, projects, volunteering, clubs, or personal challenges. Outline the situation, your responsibility, your actions, and the outcome; include what you learned when useful. These examples give you flexible material for questions about teamwork, initiative, conflict, and problem-solving.',
    'Practise explaining ideas aloud at a measured pace, using clear sentences and natural pauses. Record an answer or rehearse with a trusted friend, then check whether the main point is easy to follow and where filler words appear. Make one adjustment at a time so your delivery improves without losing your natural style.',
    'Work on non-verbal habits that help others feel engaged: comfortable eye contact, open posture, an attentive expression, and a steady voice. Practise listening to the whole question before responding and taking a breath when you need time to think. Small, consistent changes make conversations calmer and more confident.',
    'Run mock introductions, group discussions, and question-and-answer sessions with a peer or mentor. Ask for specific feedback on clarity, listening, confidence, and relevance, then repeat after making one or two changes. The aim is to respond naturally in a real conversation, not to memorise perfect lines.',
  ],
  interview: [
    'Prepare a concise introduction that connects your studies or experience to the role you are pursuing. Mention one or two relevant strengths or accomplishments, then explain what interests you about the opportunity. Practise until the structure feels comfortable, while leaving room to adapt it to the interviewer.',
    'Review every claim on your resume and be ready to explain its context, your contribution, and the outcome. Refresh the technical concepts and tools you list, and prepare a clear walkthrough of each project, including one challenge and how you handled it. Specific examples make your answers credible and help you respond to follow-up questions.',
    'Prepare flexible outlines for questions about motivation, strengths, setbacks, teamwork, and future goals. Use STAR for experience-based answers, focusing on your actions and their result. Practise aloud and remove unnecessary detail so each answer is clear, relevant, and grounded in a real example.',
    'Learn what the organisation does, what the role involves, and which of your skills connect to its work. Review reliable sources such as the company website, product pages, and recent announcements, and prepare thoughtful questions of your own. Use your research to make answers specific instead of repeating generic praise.',
    'Complete practice interviews that include behavioural questions and role-relevant technical discussion. Ask a peer or mentor for feedback on structure, clarity, confidence, and listening. Review what felt difficult after each session, work on those areas, and repeat until the real interview feels like a familiar conversation.',
  ],
  dsa: [
    'Choose one language you can use consistently, such as Python, Java, or C++, and review its syntax, collections, functions, and input/output patterns. Write small programs until common operations feel familiar. A comfortable language lets you focus interview time on reasoning rather than looking up basic syntax.',
    'Study one structure or algorithm pattern in a focused sequence: understand its operations, learn its common costs, and implement it yourself before solving related problems. Compare examples to recognise when a technique applies, keep notes on mistakes, and revisit earlier topics regularly to build durable understanding.',
    'Use diagrams, traces, or interactive visualisations to follow how data changes during an algorithm. Predict what happens next before revealing it, then draw the same process by hand. This is especially helpful for pointers, recursion, trees, and graph traversal, where a clear mental model improves implementation and debugging.',
    'Start with approachable problems, write a straightforward solution, and then look for ways to improve its time or space complexity. Before reading an editorial, record your reasoning and test edge cases such as empty input, duplicates, and large values. Compare alternative solutions and reimplement the key idea later without copying.',
    'Practise selected problems with a realistic time limit after learning the relevant patterns. Clarify constraints and outline an approach before coding, then test representative cases. Afterwards, identify whether recognition, implementation, or explanation was the bottleneck and use that evidence to guide your next practice session.',
  ],
  resume: [
    'Choose a clean, single-column template that makes your experience easy to scan and is likely to parse reliably in applicant-tracking systems. Keep the visual style restrained and check that headings, spacing, and dates are consistent before adding content. The template should support your story, not compete with it.',
    'Add your education and a concise skills section that reflects tools and concepts you can confidently discuss. Include coursework or academic results when they strengthen your application, and group skills so a reader can find them quickly. Be selective: anything listed may become a follow-up question.',
    'Choose two or three projects that demonstrate abilities relevant to your target role. Explain the problem, your contribution, technologies, and result; use numbers only when you can support them. Strong bullets show decisions and impact, not just a list of tools or features.',
    'Include relevant certifications, awards, hackathon results, leadership, volunteering, or open-source contributions that add useful context. Give each item enough detail to show what you accomplished, while keeping the section concise. If an item does not support your target role or reveal a meaningful strength, use the space for stronger evidence.',
    'Review spelling, grammar, formatting, and consistency, then ask another person to check clarity. Confirm links and dates, and make sure the final PDF remains readable on another device. Use a professional filename and tailor the finished version to the role before submitting it.',
  ],
}
/* ─── FLASHCARD COMPONENT ───────────────────────────────────── */
function FlashCard({ card, theme, index }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="flashcard-wrapper"
      onClick={() => setFlipped(f => !f)}
      style={{ '--accent': theme.accent, '--accent-dim': theme.accentDim }}
    >
      <motion.div
        className="flashcard-inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-num">{String(index + 1).padStart(2, '0')}</span>
          <h4>{card.front}</h4>
          <span className="flashcard-hint">tap to reveal →</span>
        </div>
        {/* Back */}
        <div className="flashcard-face flashcard-back">
          <RotateCcw size={14} className="flashcard-flip-icon" />
          <p>{card.back}</p>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── ROADMAP COMPONENT ─────────────────────────────────────── */
function RoadmapTrack({ steps, theme, category }) {
  const [active, setActive] = useState(null)

  let seed = Array.from('resume').reduce((value, character) => value + character.charCodeAt(0), 0)
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const startX = 9 + random() * 2
  const endX = 89 + random() * 2
  const anchors = steps.map((_, index) => {
    const ratio = steps.length <= 1 ? 0 : index / (steps.length - 1)
    const idealX = startX + ratio * (endX - startX)
    const jitter = index === 0 || index === steps.length - 1 ? (random() - 0.5) * 2 : (random() - 0.5) * 9
    return {
      x: idealX + jitter,
      y: 15 + random() * 70,
    }
  })

  const path = anchors.reduce((result, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }

    const previous = anchors[index - 1]
    const span = point.x - previous.x
    const cp1x = previous.x + span * (0.2 + random() * 0.2)
    const cp1y = Math.max(8, Math.min(92, previous.y + (random() - 0.5) * 58))
    const cp2x = point.x - span * (0.2 + random() * 0.2)
    const cp2y = Math.max(8, Math.min(92, point.y + (random() - 0.5) * 58))

    return `${result} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`
  }, '')

  const selectedStep = active === null ? null : steps[active]
  const selectedDetails = active === null ? null : roadmapDetails[category][active]

  return (
    <div className="roadmap-track" style={{ '--accent': theme.accent, '--accent-dim': theme.accentDim }}>
      <div
        className="roadmap-visual"
        onClick={() => setActive(null)}
        style={{ backgroundImage: `linear-gradient(rgba(6, 10, 18, 0.72), rgba(6, 10, 18, 0.72)), ${theme.backgroundImage}` }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="roadmap-svg" aria-hidden="true">
          <path d={path} className="roadmap-path" />
        </svg>

        {steps.map((step, i) => {
          const Icon = stepIcons[step.icon] || Target
          const isActive = active === i
          const iconX = anchors[i].x
          const iconY = anchors[i].y

          return (
            <button
              key={i}
              className={`roadmap-stop ${isActive ? 'roadmap-stop--active' : ''}`}
              onClick={(event) => {
                event.stopPropagation()
                setActive(isActive ? null : i)
              }}
              style={{ left: `${iconX}%`, top: `${iconY}%` }}
              aria-label={`Open ${step.label}`}
              type="button"
            >
              <span className="roadmap-node">
                {isActive ? <span className="roadmap-number">{i + 1}</span> : <Icon size={16} />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="roadmap-detail">
        {selectedStep ? (
          <motion.div
            key={selectedStep.label}
            className="roadmap-panel roadmap-panel--active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="roadmap-panel-top">
              <span className="roadmap-panel-index">0{active + 1}</span>
            </div>
            <h3>{selectedStep.label}</h3>
            <p>{selectedDetails}</p>
          </motion.div>
        ) : (
          <div className="roadmap-panel roadmap-panel--summary">
            <div className="roadmap-panel-top">
              <span className="roadmap-panel-index">Full flow</span>
            </div>
            <div className="roadmap-summary-list">
              {steps.map((step, i) => (
                <div key={i} className="roadmap-summary-item">
                  <span className="roadmap-summary-number">{i + 1}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <p>{roadmapDetails[category][i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── LINK ITEM ─────────────────────────────────────────────── */
function LinkItem({ item, theme }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-link-item"
      style={{ '--accent': theme.accent, '--accent-dim': theme.accentDim }}
    >
      <div className="rli-top">
        <span className="rli-tag">{item.tag}</span>
        <ExternalLink size={15} className="rli-icon" />
      </div>
      <h3 className="rli-name">{item.name}</h3>
      <p className="rli-desc">{item.desc}</p>
    </a>
  )
}

export default function Resources() {
  const { category } = useParams()
  const selected = categories.find(c => c.slug === category)

  if (!category) {
    return (
      <div className="page-shell resource-library-page">
        <div className="page-hero">
          <span className="eyebrow">THE RESOURCE LIBRARY / 01</span>
          <h1>Resources</h1>
        </div>
        <div className="resource-grid resource-library-grid">
          {categories.map((c, i) => (
            <Link key={c.slug} to={`/resources/${c.slug}`}>
              <ResourceCard category={c.name} title={c.name} desc={c.description} index={i} />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (!selected) {
    return (
      <div className="page-shell">
        <h2>Resource category not found.</h2>
        <Link to="/resources">Back to Resources</Link>
      </div>
    )
  }

  const theme = themes[category] || themes.aptitude
  const guide = guides[category]

  return (
    <div
      className="rg-page"
      style={{ '--bg': theme.bg, '--accent': theme.accent, '--accent-dim': theme.accentDim, '--glow': theme.glow }}
    >
      {/* Background gradient layer */}
      <div className="rg-bg" />

      {/* Nav */}
      <div className="rg-nav">
        <Link to="/resources" className="rg-back">
          <ArrowLeft size={16} />
          <span>All Resources</span>
        </Link>
        <span className="rg-breadcrumb">{theme.label}</span>
      </div>

      {/* Hero */}
      <motion.header
        className="rg-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="rg-eyebrow">YOUR PLACEMENT PLAYBOOK</span>
        <h1 className="rg-title">{selected.name}</h1>
        <p className="rg-intro">{guide.intro}</p>
        <div className="rg-goal">
          <Target size={18} />
          <p><strong>Goal:</strong> {guide.goal}</p>
        </div>
      </motion.header>

      {/* Two-column section */}
      <section className="rg-two-col">
        {/* LEFT — Links */}
        <div className="rg-col-links">
          <div className="rg-col-header">
            <BookOpen size={20} />
            <div>
              <h2>Learning resources</h2>
              <p className="rg-col-sub">Handpicked platforms, tools and guides for this track.</p>
            </div>
          </div>
          <div className="rg-links-list">
            {guide.links.map((item, i) => (
              <LinkItem key={i} item={item} theme={theme} />
            ))}
          </div>
        </div>

        {/* RIGHT — Flashcards */}
        <div className="rg-col-cards">
          <div className="rg-col-header">
            <Lightbulb size={20} />
            <div>
              <h2>What to learn</h2>
              <p className="rg-col-sub">Tap each card to reveal what matters and why.</p>
            </div>
          </div>
          <div className="rg-flashcard-grid">
            {guide.flashcards.map((card, i) => (
              <FlashCard key={i} card={card} theme={theme} index={i} />
            ))}
          </div>
          {/* Tip */}
          <div className="rg-tip">
            <Lightbulb size={16} />
            <div>
              <span className="rg-tip-label">Apti Club Tip</span>
              <p>{guide.tip}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="rg-roadmap-section">
        <div className="rg-col-header">
          <Target size={20} />
          <div>
            <h2>Your preparation roadmap</h2>
            <p className="rg-col-sub">Click each stop to see what to do at that stage.</p>
          </div>
        </div>
        <RoadmapTrack steps={guide.steps} theme={theme} category={category} />
      </section>
    </div>
  )
}