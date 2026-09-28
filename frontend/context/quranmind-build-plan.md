# Build QuranMind — AI-Powered Quran Research Workspace

## 1. What I Want You to Build

Build a production-quality web application called **QuranMind**.

QuranMind is an **AI-powered research workspace for studying the Quran through textual, linguistic, numerical, structural, and scientific analysis**.

This is NOT:

* a normal Quran reading website
* a Quran chatbot
* a generic AI SaaS dashboard
* a website that simply claims "scientific miracles"
* a collection of static statistics

The central concept is:

> **The user investigates a Quranic question inside a research workspace while the AI agent can directly analyze Quranic data, run calculations, compare verses, discover patterns, inspect scientific sources, and organize evidence.**

The platform should behave more like a combination of:

* Quran research laboratory
* AI research assistant
* Quran database explorer
* statistical analysis tool
* evidence management system
* scientific research workspace

The AI must distinguish between:

1. What is directly present in the Quran.
2. What can be mathematically calculated from the Quran.
3. What is a linguistic interpretation.
4. What is a scientific claim.
5. What is an interpretation connecting the Quran to science.
6. What is a hypothesis.
7. What is actually supported by external evidence.

Do not automatically label interesting patterns as miracles or scientific facts.

---

# 2. Core User Experience

The primary screen is a **Research Workspace**.

The workspace has three major areas.

### Far left

Navigation sidebar.

### Center

AI Research Agent.

### Right

Quran Viewer + Evidence/Analysis panel.

The three areas must communicate with each other.

For example:

The user asks the AI:

> "حلل لي التناظر في ربك فكبر وكل في فلك يسبحون"

The AI should not merely answer with text.

It should:

1. Find the relevant Quranic verses.
2. Display them in the Quran Viewer.
3. Highlight the relevant text.
4. Send the selected text to the analysis engine.
5. Count letters.
6. Normalize the Arabic text according to defined rules.
7. Test symmetry.
8. Display the actual calculation.
9. Compare the two phrases.
10. Search for similar patterns elsewhere.
11. Tell the user which observations are verified.
12. Separate interpretations from verified observations.
13. Allow the user to continue investigating.

The workspace therefore behaves like a connected research environment.

---

# 3. Main Interface

Create a premium dark research interface.

### Visual style

* Dark navy / almost black background.
* Electric blue primary accent.
* Cyan highlights.
* Subtle green for verified evidence.
* Amber for hypotheses/warnings.
* Red only for contradictions/errors.
* Arabic-first typography.
* High information density.
* Professional scientific/research feeling.
* No generic "AI-generated SaaS" appearance.
* No excessive gradients.
* No unnecessary animations.

The Quran should feel like the central source of evidence.

---

# 4. Sidebar

The left sidebar should contain:

### Main

* الرئيسية
* القرآن الكريم
* مساحة البحث
* الوكيل الذكي

### Analysis

* تحليل الحروف
* تحليل الكلمات
* الجذور
* التكرار
* التناظر
* الأنماط العددية
* مقارنة الآيات
* التشابه

### Science

* الحقائق العلمية
* الادعاءات العلمية
* المصادر العلمية
* قيد البحث
* النتائج المتنازع عليها

### Research

* مشاريعي
* الفرضيات
* الأدلة
* الملاحظات
* المحفوظات

### Statistics

* إحصائيات القرآن
* إحصائيات الحروف
* إحصائيات الكلمات
* إحصائيات السور
* التحليل الإحصائي

### System

* إعدادات التحليل
* إعدادات القرآن
* نماذج الذكاء الاصطناعي
* الإعدادات

Allow the sidebar to collapse.

---

# 5. Quran Viewer

The Quran Viewer is one of the most important components.

It should support:

* Surah navigation.
* Ayah navigation.
* Juz.
* Page.
* Search.
* Arabic text.
* Translation.
* Word selection.
* Letter selection.
* Highlighting.
* Bookmarks.
* Notes.
* Analysis.
* Compare.
* Copy reference.

When a user clicks a word, show:

* Word.
* Root.
* Morphology.
* Position.
* Verse.
* Surah.
* Number of occurrences.
* Related words.
* Analysis actions.

Example:

```text
الكلمة:
فلك

السورة:
الأنبياء

الآية:
33

الجذر:
ف ل ك

الترتيب:
...

التكرار في القرآن:
...

[تحليل] [مقارنة] [البحث عن الجذر] [البحث عن الأنماط]
```

---

# 6. Quran Text Must Be Structured Data

Do not treat the Quran as a large text blob.

The system should understand relationships:

Quran → Surah → Ayah → Word → Letter

Each verse should have structured metadata.

For each word, make it possible to determine:

* Original form.
* Normalized form.
* Root when available.
* Position in verse.
* Position in surah.
* Global occurrence.
* Letter sequence.
* Word sequence.

This is essential because the AI must perform real calculations instead of guessing.

---

# 7. Arabic Normalization Engine

Create a dedicated Arabic normalization system.

This is extremely important.

Different analyses may require different normalization rules.

For example:

### Mode A — Exact text

Preserve the original text.

### Mode B — Remove diacritics

Remove:

* Fatha
* Damma
* Kasra
* Sukun
* Shadda
* Tanwin
* etc.

### Mode C — Structural normalization

Normalize defined orthographic variants.

### Mode D — Letters only

Remove:

* spaces
* punctuation
* verse markers

But do NOT silently modify the text.

Every analysis must show the normalization method.

Example:

```text
Analysis method:

Script:
Uthmani

Diacritics:
Ignored

Spaces:
Ignored

Punctuation:
Ignored

Orthographic normalization:
Enabled

Counting:
Arabic characters only
```

The user must be able to change these settings.

---

# 8. Counting Engine

Create a reusable Quran Analysis Engine.

The engine must calculate things such as:

### Letters

* Total letters.
* Unique letters.
* Frequency of each letter.
* Letter percentage.
* First letter.
* Last letter.
* Central letter.
* Letter positions.

### Words

* Number of words.
* Unique words.
* Word frequency.
* Repeated words.
* Word positions.

### Phrases

* Exact repetitions.
* Partial repetitions.
* Similar sequences.

### Positions

* Verse position.
* Surah position.
* Quran-wide position.

Every calculation should be deterministic.

The AI should never invent a number.

---

# 9. Example Counter System

Create interactive counters.

When the user selects:

> رَبِّكَ فَكَبِّرْ

The interface could display:

```text
عدد الكلمات
2

عدد الحروف
7

الحروف الفريدة
...

الحرف الأول
ر

الحرف الأوسط
ف

الحرف الأخير
ر
```

Then visualize:

```text
ر → ب → ك → ف → ك → ب → ر

1    2    3    4    5    6    7
```

The UI should automatically detect whether:

```text
sequence[i] == sequence[n - i - 1]
```

for symmetry.

If yes:

```text
تناظر كامل

7 / 7 positions match
```

If no:

```text
تناظر جزئي

5 / 7 positions match
```

Do not simply display "miracle".

Display the mathematical result.

---

# 10. Symmetry Engine

Build a real symmetry analysis function.

Input:

```text
Arabic string
```

Output:

```text
normalizedText
characters
length
center
isSymmetric
matchingPairs
mismatchingPairs
```

For:

```text
ربك فكبر
```

the normalized sequence may become:

```text
ربكفكبر
```

Then compare:

```text
ر ↔ ر
ب ↔ ب
ك ↔ ك
ف ↔ ف
ك ↔ ك
ب ↔ ب
ر ↔ ر
```

The UI should draw connections between mirrored characters.

Make this visual and interactive.

---

# 11. Word Symmetry

Do not limit symmetry to letters.

Support:

### Letter symmetry

```text
ر ب ك ف ك ب ر
```

### Word symmetry

```text
word1 word2 word3 word2 word1
```

### Phrase symmetry

Compare sequences of words.

### Structural symmetry

Compare:

* word count
* repeated structures
* central elements
* verse structure

---

# 12. Pattern Discovery

Create a Pattern Discovery engine.

The user can ask:

> "Find interesting numerical patterns in this verse."

The system should run actual queries.

Possible discoveries:

* repeated words
* repeated roots
* repeated letter sequences
* symmetrical sequences
* central letters
* balanced word structures
* unusual frequency
* repeated numerical relationships
* similar verses
* parallel structures

Do NOT call every unusual result significant.

Instead:

```text
Pattern detected

Frequency:
3 occurrences

Uniqueness:
Moderate

Statistical significance:
Not established

Interpretation:
Requires further investigation
```

---

# 13. AI Research Agent

The AI Agent is the brain of the platform.

It should have access to tools.

The model should NOT answer Quran research questions only from its language-model knowledge.

It should use the platform's tools whenever the answer requires Quranic data.

Example tools:

```text
search_quran
get_surah
get_ayah
get_word
count_letters
count_words
count_occurrences
normalize_arabic
compare_sequences
detect_symmetry
find_repetitions
find_similar_verses
find_root
get_word_morphology
calculate_statistics
search_scientific_sources
create_evidence
create_hypothesis
save_finding
compare_research
generate_report
```

---

# 14. AI Tool Calling

The AI should decide when a tool is required.

Example:

User:

> كم مرة وردت كلمة فلك في القرآن؟

AI should call:

```text
search_quran
```

then:

```text
count_occurrences
```

then answer using the returned data.

Never estimate.

---

# 15. AI Calculation Workflow

For numerical questions:

```text
User Question
      ↓
Understand intent
      ↓
Identify Quranic objects
      ↓
Retrieve exact text
      ↓
Apply explicit normalization
      ↓
Run analysis tool
      ↓
Validate result
      ↓
Explain calculation
      ↓
Present evidence
```

The AI should expose enough information for the researcher to reproduce the result.

---

# 16. AI Research Workflow

For deeper research:

```text
Question
 ↓
Quran Retrieval
 ↓
Text Analysis
 ↓
Pattern Detection
 ↓
Scientific Search if needed
 ↓
Evidence Collection
 ↓
Counter-Evidence Search
 ↓
Statistical Validation
 ↓
Interpretation
 ↓
Research Status
```

---

# 17. AI Agent Interface

The center-left panel should look like a serious research assistant.

Example:

```text
┌─────────────────────────────────────┐
│ الوكيل الذكي                        │
│ ● متصل                              │
├─────────────────────────────────────┤
│                                     │
│ المستخدم                            │
│ حلل لي التناظر في الآيتين            │
│                                     │
│ AI                                  │
│ سأتحقق من النص أولاً ثم سأطبق       │
│ تحليل التناظر وفق قواعد محددة.      │
│                                     │
│ ✓ تم العثور على الآيتين             │
│ ✓ تم تطبيع النص                     │
│ ✓ تم تحليل 7 أحرف                   │
│ ✓ تم العثور على تناظر كامل          │
│                                     │
│ [عرض الحساب] [عرض الآية]            │
│                                     │
├─────────────────────────────────────┤
│ اكتب سؤالك...                 [➤]  │
└─────────────────────────────────────┘
```

---

# 18. AI Must Show Its Research Evidence

When the AI gives a claim, allow the user to expand:

```text
مصدر النتيجة

الآية:
...

التحليل:
...

طريقة الحساب:
...

الأداة المستخدمة:
...

البيانات:
...

النتيجة:
...
```

This makes the AI auditable.

---

# 19. Evidence System

Every research finding should become an Evidence object.

An evidence object contains:

```text
type
title
description
source
verseReferences
calculation
method
status
confidence
createdAt
```

Evidence types:

* Quranic
* Mathematical
* Linguistic
* Scientific
* Historical
* Statistical
* User hypothesis

---

# 20. Evidence Status

Use clear epistemic statuses.

### Verified Observation

Directly reproducible from the Quranic dataset.

### Scientifically Supported

Supported by reliable scientific evidence.

### Possible Correspondence

Interesting relationship but interpretation is required.

### Hypothesis

Requires additional investigation.

### Disputed

Evidence or interpretation is contested.

### Unsupported

Insufficient evidence.

The interface should make these visually distinct.

---

# 21. Scientific Research System

The platform should allow the user to investigate claims such as:

> "Does this Quranic expression correspond to a scientific phenomenon?"

The AI should break this into:

### Quranic claim

What does the verse actually say?

### Linguistic analysis

What meanings are supported by Arabic sources?

### Scientific claim

What exactly does modern science say?

### Historical question

Was this scientific concept known in the relevant historical period?

### Relationship

Is the relationship:

* explicit?
* possible?
* metaphorical?
* interpretive?
* unsupported?

---

# 22. Scientific Source Search

When scientific claims are investigated, store source information.

For example:

```text
Scientific source

Title
Authors
Institution
Publication
Date
DOI
URL
Field
Relevant finding
```

The AI should prioritize authoritative scientific sources.

Do not use a random blog as the primary scientific authority.

---

# 23. Example: Number 7

Suppose the user says:

> "The phrase has 7 letters and this relates to seven layers of the atom."

The AI must split this into two separate claims.

### Claim A

"The phrase contains 7 letters."

This can be mathematically verified.

### Claim B

"Atoms consist of seven layers."

This is an independent scientific claim requiring scientific verification.

Then:

### Claim C

"The Quran intentionally connects these two concepts."

This is an interpretation/hypothesis.

The AI must NOT automatically combine A+B+C into:

> "This proves a scientific miracle."

Instead:

```text
Verified observation:
7 letters.

Scientific claim:
Requires scientific verification.

Relationship:
Interpretive hypothesis.
```

This distinction is one of the core principles of the platform.

---

# 24. Counter-Evidence

The AI must actively search for alternative explanations.

For example:

```text
Finding:
7-letter symmetry detected.

Potential limitation:
The selected phrase may have been chosen
because it produces a symmetrical result.

Suggested test:
Search all Quranic phrases of equivalent
length and compare the frequency of symmetry.
```

This is important.

The platform should help the user **test** ideas, not only confirm them.

---

# 25. Statistical Engine

Build statistical functions for research.

Examples:

* frequency
* probability
* distribution
* baseline comparison
* random sampling
* permutation testing
* occurrence rates
* pattern frequency
* multiple comparison warnings

Example:

```text
Observed:
1 symmetrical phrase

Comparison dataset:
10,000 phrases

Similar patterns:
...

Relative frequency:
...

Statistical interpretation:
...
```

Do not automatically claim statistical significance unless an appropriate test supports it.

---

# 26. Selection Bias Detection

If a user chooses a specific phrase after seeing a pattern, warn:

```text
Research note

This analysis begins from a selected example.
Because the phrase was selected after observing
the pattern, selection bias may be present.

Suggested next step:
Run the same analysis across a predefined
dataset.
```

Make this a normal research feature rather than an annoying warning.

---

# 27. Compare Mode

Allow users to compare:

* two verses
* two words
* two phrases
* two surahs
* two roots
* two numerical patterns

Example:

```text
VERSE A                    VERSE B

ربك فكبر                   كل في فلك

7 letters                  7 letters

Symmetric                  Symmetric

Center: ف                  Center: ف
```

Add visual connections between matching characters.

---

# 28. Quran Statistics

Create a statistics workspace.

Show:

* Total verses
* Total words
* Total letters
* Unique words
* Root frequencies
* Letter frequencies
* Word frequencies
* Surah statistics

Allow filtering:

```text
Entire Quran
Surah
Juz
Selected verses
Selected words
```

---

# 29. Interactive Charts

Charts should be generated from actual database queries.

Examples:

### Letter frequency

Bar chart.

### Word frequency

Bar chart.

### Word distribution

Timeline / Quran position chart.

### Root distribution

Network or frequency visualization.

### Symmetry

Comparison visualization.

### Verse length

Distribution chart.

Users should be able to click chart elements and navigate directly to the Quran.

---

# 30. Research Workspace State

The workspace should maintain state.

For example:

```text
Current Project:
Seven Letter Investigation

Selected Verses:
...

Selected Words:
...

Current Analysis:
Symmetry

Current Evidence:
...

Current Hypotheses:
...

AI Conversation:
...

Notes:
...
```

When the user leaves and returns, the workspace should continue from where they stopped.

---

# 31. Research Projects

A project can contain:

* Title
* Description
* Questions
* Selected verses
* Findings
* Evidence
* Hypotheses
* Calculations
* Sources
* AI conversation
* Notes
* Status

Example:

```text
Project:
"Seven-Letter Symmetry"

Research question:
Does the observed symmetry occur elsewhere
in the Quran at a statistically unusual rate?

Status:
Investigating
```

---

# 32. Hypothesis System

Allow the user to create hypotheses.

Example:

```text
Hypothesis:

The repeated seven-character symmetrical
structures occur more frequently than expected
under a suitable baseline.

Status:
Untested
```

Then the AI can create tests.

```text
Test 1:
Search all seven-character sequences.

Test 2:
Measure palindrome frequency.

Test 3:
Compare against randomized Arabic sequences.

Test 4:
Compare against non-selected Quranic passages.
```

---

# 33. Research Notebook

Include a notebook-like panel.

Users can write:

* observations
* questions
* conclusions
* calculations
* references

Allow AI to convert a conversation into a structured research note.

Example:

```text
Observation
...

Evidence
...

Method
...

Interpretation
...

Limitations
...

Next experiment
...
```

---

# 34. Research Graph

Provide an optional visual graph.

Example:

```text
آية
 │
 ├── كلمة
 │    └── جذر
 │
 ├── تناظر
 │
 ├── عدد
 │
 ├── دلالة لغوية
 │
 └── ادعاء علمي
       │
       └── مصدر علمي
```

Clicking a node should open the relevant evidence.

---

# 35. AI Suggested Investigations

The AI should proactively suggest useful next steps.

Example:

```text
اكتشاف مثير للاهتمام

وجدنا تناظرًا كاملاً من 7 أحرف.

يمكننا الآن اختبار:

→ هل توجد أمثلة مشابهة؟
→ ما نسبة انتشار هذا النوع؟
→ هل يظهر في مواضع أخرى؟
→ ماذا يحدث عند تغيير طريقة التطبيع؟
→ هل النتيجة حساسة لاختيار الرسم؟
```

This is one of the most important AI features.

---

# 36. Sensitivity Analysis

If a numerical result depends on counting rules, automatically test different configurations.

For example:

```text
Configuration A
Diacritics removed
Result: 7

Configuration B
Exact Uthmani text
Result: ...

Configuration C
Orthographic normalization
Result: ...
```

Then display:

```text
Result stability:
Stable / Sensitive
```

This prevents misleading numerical conclusions.

---

# 37. Research Reproducibility

Every analysis should be reproducible.

Save:

* Quran version
* text version
* normalization configuration
* query
* calculation
* dataset
* analysis timestamp
* algorithm/version

A user should be able to click:

> "How was this result obtained?"

and see the complete methodology.

---

# 38. Quran Reference System

Every verse reference should be clickable.

Example:

```text
[الأنبياء 33]
```

Clicking it opens the verse in the Quran viewer.

The same applies to:

* word references
* research evidence
* scientific sources
* saved findings

---

# 39. AI Context

The AI should receive structured context rather than only raw chat history.

Example context:

```text
Current project
Selected verses
Selected words
Current analysis
Previous findings
Evidence
Hypotheses
Normalization rules
Research status
```

This allows long investigations without losing context.

---

# 40. AI Memory

Within a research project, the AI should remember:

* Previous questions
* Previous findings
* Rejected hypotheses
* Selected verses
* Analysis settings
* Evidence
* Sources

Example:

User:

> "Continue the previous test."

The AI should know which test is being discussed.

---

# 41. AI Models

Create an AI provider abstraction.

Do not hard-code one model.

Support configurable providers such as:

* OpenAI
* Anthropic
* Google
* OpenRouter
* Local models
* Ollama

The application should have an AI settings page.

Allow:

```text
Provider
Model
Temperature
Max tokens
Research mode
Tool calling
```

The architecture should make adding providers easy.

---

# 42. AI Modes

Provide:

### Quick Answer

Fast answer using Quran database.

### Analysis

Run Quran analysis tools.

### Research

Perform multi-step investigation.

### Deep Research

Combine:

* Quran retrieval
* calculations
* pattern analysis
* scientific sources
* counter-evidence
* statistical validation

### Challenge

Ask the AI to actively challenge the current hypothesis.

This is especially useful for preventing confirmation bias.

---

# 43. Challenge Mode

Example:

User:

> "I think the number 7 proves this scientific connection."

AI Challenge Mode:

```text
Let's attempt to falsify this hypothesis.

1. Verify the numerical observation.
2. Test alternate counting methods.
3. Search for similar examples.
4. Search for counterexamples.
5. Test whether the relationship was selected
   after observing the result.
6. Examine the scientific premise.
7. Determine whether the connection is explicit
   or interpretive.
```

This should be a major feature.

---

# 44. User Interaction With Quran

When selecting text, display contextual action buttons:

```text
[Count]
[Analyze]
[Compare]
[Find Similar]
[Find Root]
[Find Repetition]
[Check Symmetry]
[Search Science]
[Ask AI]
[Save Finding]
```

"Ask AI" should automatically insert the selected Quranic reference into the AI context.

---

# 45. Right Evidence Panel

The right side should contain tabs such as:

```text
الأدلة
التحليل
المخططات والبيانات
المصادر
الملاحظات
```

When the user selects a verse, this panel updates.

---

# 46. Example Right Panel

For:

> ربك فكبر

display:

```text
تحليل الآية

عدد الكلمات
2

عدد الحروف
7

التناظر
100%

الحرف المركزي
ف

التسلسل

ر ب ك ف ك ب ر

1 2 3 4 5 6 7
```

Then:

```text
الأدلة المرتبطة

✓ ملاحظة نصية قابلة للتحقق
✓ تناظر حرفي
○ العلاقة العلمية: تحتاج بحثاً
```

---

# 47. Scientific Claims Panel

For each scientific claim:

```text
الادعاء

"دوران الأجرام السماوية..."

نوع الادعاء:
علمي

المصدر:
...

الحالة:
مدعوم / متنازع عليه / يحتاج بحث

الأدلة:
...

القيود:
...
```

Do not visually imply certainty when there is none.

---

# 48. Search

Create global search.

Search should work across:

* Quran
* verses
* words
* roots
* projects
* evidence
* hypotheses
* scientific sources

Arabic search must be robust.

Support normalized searching.

---

# 49. Performance

Do not perform expensive Quran-wide calculations on every UI render.

Use:

* indexed Quran data
* database queries
* caching
* precomputed statistics where appropriate
* background jobs for expensive analyses

Simple operations should feel instant.

Heavy analysis can show:

```text
جارٍ تحليل 6,236 آية...
```

with progress.

---

# 50. Architecture Principle

Separate the system into conceptual layers:

### Quran Data Layer

The canonical Quranic dataset.

### Analysis Engine

Deterministic calculations.

### Research Knowledge Layer

Evidence, claims, hypotheses, sources.

### AI Agent Layer

Reasoning + tool orchestration.

### External Research Layer

Scientific and linguistic sources.

### Workspace Layer

User projects, notes, sessions, UI state.

Do not let the LLM directly manipulate Quran data without controlled tools.

---

# 51. Important AI Rule

The AI is an orchestrator.

It should use deterministic functions for deterministic facts.

For example:

Bad:

```text
LLM:
I think the word appears 27 times.
```

Correct:

```text
AI
↓
count_occurrences("فلك")
↓
Database
↓
Result = X
↓
AI explains result
```

The same applies to:

* letter counts
* word counts
* symmetry
* positions
* frequency
* statistical calculations

---

# 52. Database Principle

Use a relational database for structured Quran and research data.

The system should support relationships between:

* Surahs
* Ayahs
* Words
* Letters
* Roots
* Research Projects
* Findings
* Evidence
* Hypotheses
* Scientific Claims
* Sources
* AI Conversations
* Analysis Runs

Do not store important research information only inside JSON blobs or chat messages.

---

# 53. Analysis Run

Every substantial analysis should generate an Analysis Run.

Example:

```text
Analysis Run

ID:
...

Input:
ربك فكبر

Normalization:
remove_diacritics=true
remove_spaces=true

Algorithm:
symmetry-v1

Result:
symmetric=true

Characters:
7

Execution:
...

Dataset:
Quran edition/version
```

This makes the platform auditable.

---

# 54. Saved Finding

Allow the user to save a discovery.

Example:

```text
Finding:

Title:
سبعة أحرف متناظرة

Observation:
The selected sequence contains seven
characters and is symmetric under the
specified normalization rules.

Evidence:
...

Method:
...

Status:
Verified observation

Interpretation:
...

Limitations:
...
```

---

# 55. Export

Allow exporting research as:

* PDF
* Markdown
* JSON
* CSV

The exported research should include:

* Quran references
* calculations
* methodology
* evidence
* sources
* limitations
* hypotheses

---

# 56. Public Research

Later, allow users to publish a research project.

Public page:

```text
Research title

Question

Quranic evidence

Analysis

Calculations

Scientific sources

Alternative explanations

Conclusion

Research status
```

Other users can inspect the methodology.

---

# 57. Collaboration

Future feature:

* Share research project.
* Invite researchers.
* Comments.
* Evidence discussions.
* Version history.

Do not implement this unnecessarily in MVP unless the architecture allows it.

---

# 58. Security

Implement:

* Authentication
* Authorization
* Project ownership
* Secure API keys
* Server-side AI calls
* Rate limiting
* Input validation
* Database protection

Never expose private AI API keys to the browser.

---

# 59. Main User Journey

A typical session should work like this:

```text
User opens QuranMind
        ↓
Creates research project
        ↓
Searches Quran
        ↓
Selects verses
        ↓
Asks AI
        ↓
AI retrieves verses
        ↓
AI calls analysis tools
        ↓
Analysis engine calculates
        ↓
Results appear in workspace
        ↓
AI explains results
        ↓
Evidence cards created
        ↓
User creates hypothesis
        ↓
AI tests hypothesis
        ↓
Scientific sources are searched
        ↓
Counter-evidence is checked
        ↓
Research result is saved
```

---

# 60. Example Full Investigation

User asks:

> "هل هناك تناظر في ربك فكبر وكل في فلك يسبحون؟"

AI:

### Step 1

Retrieve exact verses.

### Step 2

Display them in Quran Viewer.

### Step 3

Normalize text.

### Step 4

Count letters.

### Step 5

Run symmetry algorithm.

### Step 6

Display:

```text
ربك فكبر
7 characters
Symmetric: YES

كل في فلك
7 characters
Symmetric: YES
```

### Step 7

AI searches for similar patterns.

### Step 8

AI compares the frequency of such patterns.

### Step 9

AI investigates the scientific claims associated with the user's interpretation.

### Step 10

AI creates separate evidence objects.

### Step 11

AI identifies which parts are verified and which are interpretations.

### Step 12

AI suggests additional tests.

This is the type of behavior the finished product must demonstrate.

---

# 61. Do Not Build Fake Functionality

Do not create buttons that only display fake results.

If the interface has:

> "Analyze"

it must actually perform analysis.

If it has:

> "Count letters"

it must actually count letters from the database.

If it has:

> "Find similar"

it must actually search.

If it has:

> "Scientific sources"

it must actually retrieve or query a real source system.

If a feature is not implemented, mark it as unavailable instead of pretending it works.

---

# 62. Do Not Hard-Code the Example

The "ربك فكبر" example is only a demonstration.

The system must work with arbitrary:

* verses
* words
* phrases
* surahs
* roots
* letter sequences

A user should be able to select any Quranic text and run the same analysis tools.

---

# 63. MVP Priority

Build the first working version around the following:

### Essential

1. Quran database.
2. Quran viewer.
3. Arabic search.
4. Verse selection.
5. AI research agent.
6. Tool calling.
7. Letter counter.
8. Word counter.
9. Occurrence counter.
10. Arabic normalization.
11. Symmetry detection.
12. Verse comparison.
13. Evidence cards.
14. Research projects.
15. Saved findings.
16. AI conversation context.
17. Analysis history.

### Second phase

* Root analysis.
* Morphology.
* Similar verses.
* Advanced statistics.
* Scientific sources.
* Hypothesis testing.
* Research graph.
* Deep research.
* Counter-evidence engine.

### Later

* Collaboration.
* Public research.
* Community.
* Advanced scientific literature integration.
* Automated large-scale pattern discovery.

---

# 64. UX Quality Requirements

The interface must feel like a real professional research application.

Avoid:

* huge marketing hero sections inside the workspace
* excessive empty space
* generic SaaS cards
* fake statistics
* unnecessary gradients
* excessive animations
* chatbot-only design
* confusing navigation

Prioritize:

* readable Quran text
* clear evidence
* powerful search
* visible calculations
* research context
* connected panels
* fast interaction
* clear status indicators

---

# 65. Final Product Definition

The final application should feel like:

> **"I can open the Quran, select something interesting, ask an AI researcher to investigate it, watch the actual calculations happen, inspect the evidence, challenge the result, compare it with other Quranic passages, investigate scientific claims, and save the entire investigation as a reproducible research project."**

That is the core product.

Build the system around this interaction rather than around a generic dashboard.

---

# 66. Final Development Instruction

Before implementing UI details, first understand the complete system behavior described above.

Do not begin by creating random pages.

First implement the underlying functional flow:

**Quran Data → Retrieval → Analysis Tools → AI Tool Calling → Evidence → Research Workspace → Saved Investigation**

Then build the interface around that functional model.

The AI agent must be able to interact with the platform's analysis functions rather than simply generating text.

Every numerical Quranic result must come from deterministic code/database calculations.

Every scientific claim must be represented separately from Quranic observations.

Every research result must expose its methodology and evidence.

The application should be extensible so that new analysis tools can be added to the AI agent later without redesigning the entire platform.
