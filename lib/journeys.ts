export type JourneyStep = {
  id: string;
  title: string;
  readingTimeMin?: number;
  content: string; 
  prompts: string[];
};

export type Journey = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  estimatedDays?: number;
  steps: JourneyStep[];
};

export const JOURNEYS: Journey[] = [
  {
    slug: "emotional-reset",
    title: "Emotional Reset",
    subtitle: "A gentle restart when everything feels heavy.",
    description:
      "A structured journey with small daily steps, grounding exercises, and journaling prompts to help you rebuild clarity and self-trust.",
    tags: ["grounding", "journaling", "self-compassion"],
    estimatedDays: 7,
    steps: [
  {
    id: "1",
    title: "Day 1: Where I Am Right Now",
    readingTimeMin: 8,
    content:
      "Welcome. Today is not about fixing you. It’s about finding you.\n\n" +
      "When life feels heavy, the mind tends to blur everything into one word: ‘bad.’ But your nervous system responds better to clarity than to criticism. Naming what’s happening, gently and precisely, can reduce the intensity of the emotional wave and give you a little room to breathe.\n\n" +
      "Try this: pick 3 words for what you feel (e.g., ‘sad,’ ‘overwhelmed,’ ‘lonely’). If that’s hard, start with body signals: pressure in the chest, tension in the jaw, restless legs. Then ask: ‘What might this sensation be asking for?’\n\n" +
      "Your only goal today: a truthful snapshot. No judgment. No solutions required. Just reality, held with steadier hands.\n\n" +
      "Mantra: I can be honest about my pain without becoming my pain.",
    prompts: [
      "If my mind had a weather forecast today, it would be…",
      "Three emotion-words that fit today are…",
      "In my body, I notice… (where, what kind of sensation, how strong 0–10)",
      "The thought that keeps looping today is…",
      "One need I have right now (not a want) is…",
      "If today had a title, it would be…",
    ],
  },
  {
    id: "2",
    title: "Day 2: Grounding in the Body",
    readingTimeMin: 9,
    content:
      "Today we’re building a small island of steadiness inside your body.\n\n" +
      "Grounding is not a magic trick. It’s a way of telling your nervous system: ‘Right now, in this moment, I’m safe enough to exhale.’\n\n" +
      "Practice (3 minutes):\n" +
      "1) Place one hand on your belly.\n" +
      "2) Inhale slowly through the nose, letting the belly rise.\n" +
      "3) Exhale longer than you inhale, as if fogging a mirror softly.\n" +
      "4) Add a tiny pause after the exhale if it feels comfortable.\n\n" +
      "Then do a quick 5–4–3–2–1 scan: 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.\n\n" +
      "We’re not aiming for ‘calm.’ We’re aiming for ‘a little less pulled apart.’\n\n" +
      "Mantra: I return to my body like I’m returning home.",
    prompts: [
      "Before grounding, my body felt…",
      "After grounding, the smallest shift I noticed was…",
      "One place in my body that feels neutral or okay is…",
      "A sensation I can soften by 1% today is…",
      "What helps me feel safer in my environment right now is…",
    ],
  },
  {
    id: "3",
    title: "Day 3: One Small Action That Helps",
    readingTimeMin: 8,
    content:
      "When motivation disappears, action can lead the way.\n\n" +
      "Today is about choosing one small, doable behavior that supports you, even if your feelings don’t cooperate. Think ‘tiny and kind,’ not ‘perfect and intense.’\n\n" +
      "Pick ONE micro-action (10 minutes or less):\n" +
      "• a short walk\n" +
      "• shower + clean clothes\n" +
      "• open a window and drink water\n" +
      "• tidy one surface\n" +
      "• reply to one message\n\n" +
      "Your brain learns through evidence. Each small action is evidence that you can influence your day, even when it’s hard.\n\n" +
      "Mantra: I don’t need the whole staircase. I only need the next step.",
    prompts: [
      "If I could make today 2% easier, I would…",
      "My chosen micro-action is…",
      "The obstacle that might interfere is… and my backup plan is…",
      "After I did it (or attempted it), I noticed…",
      "One supportive message I would tell a friend in my situation is…",
    ],
  },
  {
    id: "4",
    title: "Day 4: Self-Compassion, Not Self-Pressure",
    readingTimeMin: 10,
    content:
      "Today we practice a different kind of strength: kindness.\n\n" +
      "Self-compassion isn’t letting yourself ‘off the hook.’ It’s giving yourself the conditions to recover. Pressure can create movement, but compassion creates healing.\n\n" +
      "Try the 3-step self-compassion pause:\n" +
      "1) Name the difficulty: ‘This is a hard moment.’\n" +
      "2) Remember shared humanity: ‘I’m not alone in feeling this.’\n" +
      "3) Offer kindness: ‘May I be gentle with myself right now.’\n\n" +
      "If kindness feels fake, make it practical: ‘What would be the most supportive next choice for me today?’\n\n" +
      "Mantra: I can be on my own side, even while I’m learning.",
    prompts: [
      "The harsh sentence my inner critic repeats is…",
      "If I answered with compassion, I would say…",
      "A boundary I need (with people, tasks, or expectations) is…",
      "One way I can care for myself today without earning it is…",
      "What ‘being on my side’ looks like in real life is…",
    ],
  },
  {
    id: "5",
    title: "Day 5: Write It Out, Then Make Meaning",
    readingTimeMin: 12,
    content:
      "Today we use writing as a container. Not to spiral, but to metabolize.\n\n" +
      "Part A (10 minutes): Write freely about what’s been weighing on you. Don’t worry about grammar. If you feel flooded, slow down and return to your breath.\n\n" +
      "Part B (3 minutes): Now add one gentle layer of meaning. Ask:\n" +
      "• What is this pain protecting?\n" +
      "• What does it need me to know?\n" +
      "• What matters to me underneath this?\n\n" +
      "You’re not rewriting your story into a fairytale. You’re rewriting it into something you can hold.\n\n" +
      "Mantra: I can face the truth and still choose tenderness.",
    prompts: [
      "What I’m carrying right now is…",
      "The part that hurts the most is…",
      "What I wish someone understood about me is…",
      "If this pain had a message, it would say…",
      "One meaning I can make without minimizing my feelings is…",
      "One small relief I can offer myself after writing is…",
    ],
  },
  {
    id: "6",
    title: "Day 6: Noticing What’s Still Here",
    readingTimeMin: 8,
    content:
      "Today we practice a skill that depression and stress often steal: noticing.\n\n" +
      "Gratitude isn’t pretending everything is fine. It’s training your attention to also register what supports you, even quietly.\n\n" +
      "Try ‘Three Good Things’:\n" +
      "• One small good thing (even tiny)\n" +
      "• Why it happened or what you did to invite it\n" +
      "• How it felt in your body (even for 5 seconds)\n\n" +
      "This is not about forcing positivity. It’s about rebuilding balance.\n\n" +
      "Mantra: I can hold pain and still make room for light.",
    prompts: [
      "Three good things from the last 24 hours (small counts) are…",
      "One person/thing that supported me recently is…",
      "A moment I would like to remember is… because…",
      "A strength I showed this week, even imperfectly, is…",
      "One gentle thing I can do tomorrow to invite more ‘good moments’ is…",
    ],
  },
  {
    id: "7",
    title: "Day 7: A Plan for When It Gets Heavy Again",
    readingTimeMin: 11,
    content:
      "Today is about continuity. Not a ‘finish line.’ A handrail.\n\n" +
      "Set up a simple reset plan you can reuse:\n\n" +
      "1) My signals (how I know I’m slipping):\n" +
      "   • …\n" +
      "2) My first-aid actions (10 minutes or less):\n" +
      "   • water + light + breath\n" +
      "   • one message to someone safe\n" +
      "   • one small task\n" +
      "3) My support list:\n" +
      "   • names, communities, professionals\n\n" +
      "Optional sleep support (gentle version): reserve your bed for sleep, keep a consistent wake time when possible, and if you’re stuck awake for a long time, step out of bed briefly and return when sleepy.\n\n" +
      "You’re building self-trust through repetition, not intensity.\n\n" +
      "Mantra: I can restart as many times as I need.",
    prompts: [
      "My early warning signs are…",
      "My top 3 ‘10-minute resets’ are…",
      "The easiest support I can reach for is…",
      "A boundary that protects my mental space is…",
      "My next 7 days would feel better if I did this consistently: …",
      "A closing letter to myself (2–5 sentences) is…",
    ],
  },
],
  },
  // JOURNEY 1
{
  slug: "anxiety-grounding",
  title: "Anxiety Grounding Protocol",
  subtitle: "A calm plan for anxious moments and anxious days.",
  description:
    "A 7-day grounding journey to steady your nervous system, reduce overwhelm, and build a practical toolkit for anxiety spikes and lingering anxious days.",
  tags: ["anxiety", "grounding", "mindfulness"],
  estimatedDays: 7,
  steps: [
    {
      id: "1",
      title: "Day 1: Your Anxiety Map (Mind + Body)",
      readingTimeMin: 10,
      content:
        "Let’s start with something that reduces fear immediately: understanding what’s happening. Anxiety can feel mysterious and overwhelming, like it comes out of nowhere. But your body and mind usually follow a pattern.\n\nToday, we’re not trying to “stop anxiety.” We’re learning how it moves through you. When you can map it, you can respond with more skill and less panic.\n\nPractice: Draw two columns: Mind and Body. Under Mind, write 3–6 anxious thoughts you often get (even if they sound irrational). Under Body, write 3–6 sensations (tight chest, buzzing legs, nausea, jaw tension, rapid heart, etc.). Circle the first sign you usually notice.\n\nNow add one more line: “When anxiety shows up, it’s usually trying to protect me from ______.” You don’t have to like it. Just name it.\n\nMantra: When I can name it, I can meet it.\n\nIf you’re feeling intense today, keep it simple: one thought, one body sensation, one need. We will build from there.",
      prompts: [
        "My anxiety usually sounds like…",
        "My anxiety usually feels like…",
        "The earliest sign I notice is…",
        "Anxiety is trying to protect me from…",
      ],
    },
    {
      id: "2",
      title: "Day 2: The Senses Reset (5–4–3–2–1)",
      readingTimeMin: 9,
      content:
        "Anxiety pulls you into the future. Your mind starts time-traveling: “What if… what if… what if…” Grounding brings you back into the present, where your body can actually settle.\n\nThis is not a trick. It’s nervous-system training. The more you practice in calm moments, the easier it is to access during spikes.\n\nPractice: 5–4–3–2–1 grounding. Slowly name: 5 things you see, 4 things you can touch (and touch them), 3 things you hear, 2 you smell, 1 you taste. Go at half-speed. Let your shoulders drop as you do it.\n\nIf the mind interrupts with “This won’t work,” gently say: “Noted.” Then return to the next sense. You’re practicing attention, not perfection.\n\nMantra: I return to the room I’m actually in.\n\nTiny shifts matter. If anxiety drops even 1%, that’s proof your system can change state.",
      prompts: [
        "After grounding, my body feels…",
        "The hardest sense to focus on is… and I think it’s because…",
        "One object/sound that helped anchor me was…",
      ],
    },
    {
      id: "3",
      title: "Day 3: Breathing to Signal Safety",
      readingTimeMin: 10,
      content:
        "When anxiety rises, your body is acting like there’s an emergency. Breathing is one of the few direct ways you can tell the nervous system: “We’re safe enough in this moment.”\n\nYou don’t need huge calm. You need enough calm to choose your next step.\n\nPractice: Try 4–6 breathing for 3 minutes. Inhale through the nose for 4, exhale slowly for 6. If you want, add a gentle sigh at the end of the exhale. Keep the shoulders soft.\n\nIf breath practices make you dizzy, shorten it: inhale 3, exhale 4. Or breathe normally and just lengthen the exhale slightly.\n\nMantra: Longer exhales teach my body: we are safe enough.\n\nAfterward, place a hand on your chest for one breath and notice: “What is different, even slightly?”",
      prompts: [
        "After breathing, I notice…",
        "My mind tried to pull me into…",
        "A phrase that helps me stay with the breath is…",
      ],
    },
    {
      id: "4",
      title: "Day 4: Thought Labeling (Without Arguing)",
      readingTimeMin: 11,
      content:
        "One of the most exhausting anxiety habits is debating your thoughts. “What if it happens?” “But it probably won’t.” “But what if it does?” That loop is draining.\n\nToday we use a gentler skill: labeling. Labeling doesn’t fight the thought. It creates distance.\n\nPractice: When an anxious thought appears, add one of these prefixes:\n(1) “I’m having the thought that…”\n(2) “My anxiety is telling me…”\n(3) “This is a fear story.”\n\nThen do one grounding action (touch a surface, feel your feet, take one long exhale). You’re teaching your brain: thoughts can exist without controlling you.\n\nMantra: A thought is not a command.\n\nIf you want to go deeper, ask: “If this thought were true, what would I need?” Often the answer is reassurance, support, or rest, not more thinking.",
      prompts: [
        "The loudest thought today was…",
        "When I labeled it, the intensity changed by…",
        "If this fear had a need underneath, it might be…",
      ],
    },
    {
      id: "5",
      title: "Day 5: Safety Cues (Your Calm Menu)",
      readingTimeMin: 10,
      content:
        "Your nervous system learns from cues: warmth, softness, familiar sounds, slow movement, supportive connection. These are not “small things.” They are regulation signals.\n\nWhen you’re anxious, your brain forgets options. So we create a menu in advance.\n\nPractice: Make a Safety Cues list with 10 items, divided into:\nBody cues (warm drink, shower, blanket, stretching)\nEnvironment cues (open window, lower lights, tidy one surface)\nConnection cues (text one safe person, pet an animal)\nMind cues (3 slow breaths, a grounding phrase)\n\nChoose 2 cues and do them today, even if you’re not highly anxious. We are building access.\n\nMantra: I can send safety signals on purpose.\n\nIf guilt comes up (“I should handle this alone”), respond like a therapist would: support is a strength, not a flaw.",
      prompts: [
        "My strongest safety cue is…",
        "Two cues I’ll practice this week are…",
        "When I use cues, I feel more…",
      ],
    },
    {
      id: "6",
      title: "Day 6: Worry Time (Containment, Not Suppression)",
      readingTimeMin: 11,
      content:
        "Anxiety expands when worry has unlimited airtime. Containment is different from suppression. We’re not shoving worry away; we’re giving it a boundary.\n\nPractice: Schedule 10 minutes of “Worry Time.” Set a timer. Write every worry as fast as you can. When the timer ends, close your notebook and say out loud: “That’s enough for today.”\n\nOutside Worry Time, use: “Not now, later.” Then immediately do one grounding action (drink water, 5–4–3–2–1, one slow exhale).\n\nMantra: I can contain worry without ignoring it.\n\nAt first, your mind may protest. That’s normal. You’re changing a habit. Habits protest before they soften.",
      prompts: [
        "My worry-time topic today is…",
        "Outside worry time, I will redirect by…",
        "The difference I notice when I contain worry is…",
      ],
    },
    {
      id: "7",
      title: "Day 7: Your Personal Grounding Protocol",
      readingTimeMin: 12,
      content:
        "Today we turn skills into a plan. Because in real life, anxiety doesn’t ask permission. A protocol gives you a path when your mind feels foggy.\n\nPractice: Write a 3-step protocol for spikes:\nStep 1: Senses (5–4–3–2–1 or feet on the floor)\nStep 2: Breath (4–6 breathing for 60 seconds)\nStep 3: Safety cue (warm drink, message, movement)\n\nThen write one “If it gets worse” step: “If I’m escalating, I will step away, reduce stimuli, and ask for support.”\n\nMantra: I have a plan. I don’t have to panic alone.\n\nSave it somewhere easy. Future-you deserves a clear map.",
      prompts: [
        "My 3-step protocol is…",
        "The first sign I’m escalating is…",
        "If I forget everything, I will start with…",
        "A supportive message I can send someone is…",
      ],
    },
  ],
},

// JOURNEY 2
{
  slug: "self-compassion",
  title: "Self-Compassion Builder",
  subtitle: "Replace the inner critic with a steady inner ally.",
  description:
    "A 7-day journey to reduce harsh self-talk, build emotional resilience, and practice realistic self-compassion that supports growth without shame.",
  tags: ["self-compassion", "resilience", "journaling"],
  estimatedDays: 7,
  steps: [
    {
      id: "1",
      title: "Day 1: Identify Your Inner Critic Voice",
      readingTimeMin: 11,
      content:
        "Let’s start gently: you are not your inner critic. The critic is a learned strategy, often built to keep you safe through perfection, control, or anticipation of rejection.\n\nWe’re not trying to “delete” it. We’re learning to lead with a better voice.\n\nPractice: Write 3 common critic phrases you say to yourself. Then rewrite each phrase as a supportive coach who is honest but not cruel. Example:\nCritic: “You’re failing.”\nCoach: “You’re struggling. Let’s do one small thing and regroup.”\n\nNow notice: which version makes you more able to act?\n\nMantra: I can be honest without being cruel.\n\nThis is not about pretending everything is fine. It’s about choosing a tone that helps you recover and grow.",
      prompts: [
        "My inner critic often says…",
        "I think my critic is trying to protect me from…",
        "A coach-like rewrite would be…",
      ],
    },
    {
      id: "2",
      title: "Day 2: Common Humanity (You’re Not Alone)",
      readingTimeMin: 10,
      content:
        "Shame isolates. It tells you: “Only you struggle like this.” Compassion reconnects you to reality: humans struggle. You are human.\n\nThis matters because isolation fuels self-attack. Connection reduces it.\n\nPractice: Finish: “Many people feel this when…” and write 5 lines. Then write: “I am not broken. I am experiencing a human moment.”\n\nIf you can, imagine someone you care about going through the same thing. What would you want them to know? Write that down and let it apply to you too.\n\nMantra: I’m not alone in being imperfect.\n\nIf you resist this practice, that’s okay. Resistance often appears when kindness wasn’t safe in the past. We’ll go slowly.",
      prompts: [
        "Many people feel this when…",
        "If a friend felt this, I would tell them…",
        "A sentence I need to hear today is…",
      ],
    },
    {
      id: "3",
      title: "Day 3: The Self-Compassion Break",
      readingTimeMin: 10,
      content:
        "Compassion isn’t only a thought. It’s a nervous-system experience. Your body can learn what safety feels like.\n\nPractice: The Self-Compassion Break (1 minute):\n(1) Name it: “This is a hard moment.”\n(2) Normalize: “Hard moments are part of being human.”\n(3) Kindness: “May I be kind to myself right now.”\n\nPlace a hand on your chest if that feels okay. Take one slow exhale.\n\nMantra: I can be gentle with myself right now.\n\nYou may not feel warmth immediately. That’s normal. This is training, like building a muscle.",
      prompts: [
        "The hardest part of being kind to myself is…",
        "When I tried the break, my body responded by…",
        "A kinder phrase I can use is…",
      ],
    },
    {
      id: "4",
      title: "Day 4: A Compassionate Letter (With Accountability)",
      readingTimeMin: 13,
      content:
        "Real self-compassion includes accountability without punishment. It says: “This matters, and you still deserve care.”\n\nPractice: Write a letter to yourself that includes:\n(1) empathy: “Of course this is hard…”\n(2) validation: “It makes sense you feel…”\n(3) support: “Here’s what I suggest for tomorrow…”\n(4) one gentle accountability line: “One thing I can learn is…”\n\nKeep it private and imperfect. This is emotional first aid.\n\nMantra: I deserve understanding, not condemnation.\n\nIf your critic interrupts, treat it like background noise. Come back to the next sentence.",
      prompts: [
        "What I most need understanding for is…",
        "One thing I can learn from this is…",
        "A realistic supportive plan for tomorrow is…",
      ],
    },
    {
      id: "5",
      title: "Day 5: Repair After a Slip (The 3R’s)",
      readingTimeMin: 11,
      content:
        "Everyone slips. The difference between stuck and resilient is repair.\n\nPractice: The 3R’s:\nRecognize: What happened, without drama.\nReassure: A kind truth.\nRedirect: One small next action.\n\nExample:\nRecognize: “I avoided the task.”\nReassure: “Avoidance is a stress response. I’m not lazy.”\nRedirect: “I’ll do 5 minutes and stop.”\n\nMantra: I can return without punishing myself.\n\nPunishment feels motivating in the short term, but it usually breeds fear and burnout. Repair builds trust.",
      prompts: [
        "Recognize: what happened was…",
        "Reassure: a kind truth is…",
        "Redirect: my next small action is…",
      ],
    },
    {
      id: "6",
      title: "Day 6: Compassionate Boundaries (Kind Doesn’t Mean Available)",
      readingTimeMin: 12,
      content:
        "Self-compassion includes protecting your energy. You can be a kind person without being constantly available.\n\nPractice: Write one boundary you need and a one-sentence script. Examples:\n“I can’t do that today.”\n“I need time to think. I’ll reply tomorrow.”\n“I’m not available for that conversation right now.”\n\nThen write: “What fear shows up when I set this boundary?” Name it.\n\nMantra: Protecting my energy is kindness.\n\nBoundaries are not punishments. They are information: this is where I end and you begin.",
      prompts: [
        "A boundary I need is…",
        "The sentence I can use is…",
        "The fear underneath my boundary is…",
      ],
    },
    {
      id: "7",
      title: "Day 7: Your Compassion Toolkit (Keep It Accessible)",
      readingTimeMin: 12,
      content:
        "Today we gather what worked, so you don’t have to reinvent support on hard days.\n\nPractice: Build a 5-item toolkit:\n(1) one phrase\n(2) one body practice\n(3) one connection option\n(4) one boundary sentence\n(5) one ‘minimum day’ plan\n\nWrite it like you’re preparing it for your future self.\n\nMantra: I choose support over shame.\n\nThis isn’t about becoming someone new. It’s about treating yourself like someone worth caring for, consistently.",
      prompts: [
        "The most helpful practice this week was…",
        "My 5-item toolkit is…",
        "When the critic returns, I will…",
      ],
    },
  ],
},

// JOURNEY 3
{
  slug: "boundaries-reset",
  title: "Boundaries Reset",
  subtitle: "Stop people-pleasing. Start self-respecting.",
  description:
    "A 7-day journey to clarify needs, reduce guilt, and practice boundaries with simple scripts that protect your time, energy, and emotional space.",
  tags: ["boundaries", "self-respect", "clarity"],
  estimatedDays: 7,
  steps: [
    {
      id: "1",
      title: "Day 1: Where You Over-Give (And Pay Later)",
      readingTimeMin: 11,
      content:
        "People-pleasing often looks like kindness, but it quietly drains you. The cost usually shows up later as resentment, exhaustion, or a sudden shutdown.\n\nToday we’re doing a calm inventory. No judgment. Just clarity.\n\nPractice: Write 3 areas where you over-give (time, emotional labor, money, availability). For each, answer:\n(1) What do I give?\n(2) What do I hope it earns me?\n(3) What does it cost me?\n\nMantra: Awareness is the first boundary.\n\nIf you feel guilt while writing, notice it like a therapist would: guilt is a signal, not a verdict.",
      prompts: [
        "I over-give when…",
        "What I hope it earns me is…",
        "The cost of over-giving is…",
      ],
    },
    {
      id: "2",
      title: "Day 2: Needs Without Shame",
      readingTimeMin: 12,
      content:
        "Boundaries aren’t walls. They’re the shape of your needs.\n\nMany people learned to ignore needs to stay safe, loved, or accepted. If that’s you, there’s nothing wrong with you. It’s a learned survival pattern.\n\nPractice: Write 5 needs you tend to minimize (rest, quiet, clarity, support, alone time). For each need, write one sentence that validates it:\n“It makes sense I need ______ because ______.”\n\nMantra: My needs are valid information.\n\nYou don’t need to justify needs to deserve them. Validation comes first. Negotiation comes later.",
      prompts: [
        "A need I minimize is…",
        "It makes sense I need it because…",
        "When I ignore this need, I feel…",
      ],
    },
    {
      id: "3",
      title: "Day 3: The Pause Boundary (Buy Yourself Space)",
      readingTimeMin: 10,
      content:
        "A powerful boundary is a pause. Most over-giving happens because you answer too quickly.\n\nYour nervous system wants to avoid conflict, so it says yes before you even check your capacity.\n\nPractice: Use one of these sentences today:\n“Let me check and I’ll get back to you.”\n“I need some time to think about that.”\n“I’ll confirm later today.”\n\nThen practice tolerating the discomfort of not rescuing immediately.\n\nMantra: I’m allowed to take time to decide.\n\nThe pause boundary is not rude. It’s respectful: it prevents unreliable yeses.",
      prompts: [
        "A situation where I need the pause boundary is…",
        "The sentence I’ll use is…",
        "The discomfort I feel when I pause is…",
      ],
    },
    {
      id: "4",
      title: "Day 4: Saying No (Clear, Kind, Short)",
      readingTimeMin: 12,
      content:
        "A healthy ‘no’ doesn’t need a long speech. The longer the explanation, the more room for negotiation.\n\nPractice: Write 3 versions of ‘no’:\n(1) Short: “No, I can’t.”\n(2) Warm: “I appreciate you asking, but I can’t.”\n(3) Alternative: “I can’t do that, but I can do ___.”\n\nSay one out loud. Notice the body response. That’s your system learning.\n\nMantra: Clear is kind.\n\nIf guilt rises, remind yourself: you’re choosing honesty over resentment.",
      prompts: [
        "My short ‘no’ is…",
        "My warm ‘no’ is…",
        "A boundary I can keep repeating is…",
      ],
    },
    {
      id: "5",
      title: "Day 5: Handling Pushback (The Broken Record)",
      readingTimeMin: 12,
      content:
        "When you change a pattern, people notice. Pushback doesn’t mean your boundary is wrong. It means the old dynamic is being challenged.\n\nPractice: Choose one boundary sentence and repeat it calmly, without extra explanation (Broken Record).\nExample:\n“I can’t do that.”\nIf they ask why: “I can’t do that.”\nIf they push: “I understand. I still can’t do that.”\n\nMantra: Discomfort is not danger.\n\nYour job is not to manage someone else’s feelings perfectly. Your job is to be clear and respectful.",
      prompts: [
        "The pushback I fear most is…",
        "My broken-record sentence is…",
        "I can stay steady by…",
      ],
    },
    {
      id: "6",
      title: "Day 6: Boundaries With Yourself",
      readingTimeMin: 11,
      content:
        "Self-respect is built in private, through the boundaries you keep with yourself.\n\nWhen you keep small promises, you build trust. When you break them repeatedly, you teach yourself not to believe you.\n\nPractice: Choose one self-boundary for 24 hours:\n(1) phone boundary (no phone in bed)\n(2) work boundary (stop at a time)\n(3) rest boundary (a 10-minute pause)\n\nPick the smallest version you can keep.\n\nMantra: I keep promises to myself.\n\nThis is not discipline as punishment. It’s devotion to your future self.",
      prompts: [
        "My self-boundary for today is…",
        "The smallest version I can keep is…",
        "If I break it, I will repair by…",
      ],
    },
    {
      id: "7",
      title: "Day 7: Your Boundary Plan (2 Scripts, 7 Days)",
      readingTimeMin: 13,
      content:
        "Integration day. We make this practical.\n\nPractice: Choose 2 boundaries to practice for 7 days. For each, write:\n(1) the boundary\n(2) the script\n(3) the situation you’ll use it in\n(4) the repair plan if you slip\n\nMantra: My time and energy are worthy of protection.\n\nStart small. The goal is consistency, not intensity. A calm boundary repeated is more powerful than a dramatic boundary once.",
      prompts: [
        "My two boundaries are…",
        "The scripts I’ll use are…",
        "When guilt shows up, I will remind myself…",
        "My repair plan if I slip is…",
      ],
    },
  ],
},


];

export function getJourneys() {
  return JOURNEYS;
}

export function getJourneyBySlug(slug: string) {
  return JOURNEYS.find((j) => j.slug === slug) ?? null;
}

export function getStep(journey: Journey, stepId: string) {
  return journey.steps.find((s) => s.id === stepId) ?? null;
}
