import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/content/curriculum.json'
const curriculum = JSON.parse(readFileSync(path, 'utf8'))

const lessonFocus = {
  'read-sequential-programs': ['Read sequential programs', 'Trace a short Python script from first line to last line and predict its visible output.', 'Program order matters. Python executes one statement, updates state or output, then moves to the next statement unless control flow says otherwise.', 'print("ready"); print("go")', ['The first print statement displays ready.', 'The second print statement displays go.', 'Nothing runs out of order unless the code explicitly changes control flow.']],
  'tracking-variables': ['Track variable state', 'Determine variable values after assignment and reassignment.', 'Assignment is not algebra. Python evaluates the right side first, then stores the result in the name on the left.', 'coins = 4; coins = coins + 2', ['coins starts at 4.', 'The right side becomes 4 + 2.', 'The final value stored in coins is 6.']],
  'expressions-and-types': ['Expressions and types', 'Evaluate simple Python expressions and identify their resulting value types.', 'Expressions produce values, and value types decide which operations are valid next.', 'total = 3 + 4; label = "CS" + "1"', ['3 + 4 evaluates to the integer 7.', '"CS" + "1" evaluates to the string "CS1".', 'The result type affects later operations.']],
  'console-input-output': ['Console input and output', 'Predict how input, conversion, and print statements affect a short run.', 'input returns text. If a program needs a number, conversion must happen explicitly.', 'age_text = input(); age = int(age_text); print(age + 1)', ['The user entry is stored as text.', 'int converts that text to an integer when possible.', 'print displays the computed value.']],
  'program-state-snapshots': ['Program state snapshots', 'Build a small table of variable names and values at marked checkpoints.', 'A snapshot makes hidden program state visible enough to reason about without running the code.', 'x = 2; y = x + 5; x = 9', ['After y is assigned, x is 2 and y is 7.', 'After x is reassigned, x is 9.', 'y stays 7 because it does not automatically follow x.']],
  'relational-and-logical-expressions': ['Relational and logical expressions', 'Evaluate boolean expressions involving comparisons, and, or, and not.', 'Break compound conditions into smaller true or false parts before combining them.', 'age = 20; age >= 18 and age < 65', ['age >= 18 is true.', 'age < 65 is true.', 'true and true evaluates to true.']],
  'boolean-branches': ['Boolean branches', 'Predict which if or else block runs for a given program state.', 'A branch evaluates its condition first. Only the selected body runs.', 'score = 12; if score > 10: print("high") else: print("low")', ['score > 10 is true.', 'The if body runs.', 'The else body is skipped.']],
  'multi-way-selection': ['Multi-way selection', 'Trace multi-way choices when conditions overlap.', 'An if/elif/else chain checks conditions in order and stops at the first true condition.', 'points = 85; if points >= 90: grade = "A"; elif points >= 80: grade = "B"', ['The first condition is false.', 'The elif condition is true.', 'grade becomes "B".']],
  'input-validation': ['Input validation', 'Choose guard conditions that reject invalid inputs while allowing valid ones.', 'A guard protects the main logic from values the program does not claim to handle.', 'if minutes < 0: print("invalid")', ['Negative elapsed time is not meaningful.', 'The guard catches that case early.', 'Valid values can continue to the main computation.']],
  'loop-tracing': ['Trace loops', 'Trace a simple loop by recording each iteration and final state.', 'Loop tracing works best when you write down the counter and every changed variable each time the body runs.', 'total = 0; for n in [1, 2, 3]: total = total + n', ['After n = 1, total is 1.', 'After n = 2, total is 3.', 'After n = 3, total is 6.']],
  'counted-loops': ['Counted loops', 'Predict values produced by range and the resulting loop iterations.', 'range produces a predictable sequence. The stop value is not included.', 'for i in range(2, 5): print(i)', ['The first value is 2.', 'The loop also uses 3 and 4.', 'The loop stops before 5.']],
  'accumulators-and-counters': ['Accumulators and counters', 'Recognize and trace accumulator and counter update patterns.', 'An accumulator keeps a running answer. A counter is a common accumulator that increases when something is counted.', 'count = 0; for word in words: if word == "yes": count = count + 1', ['count starts at zero.', 'Each matching word adds one.', 'The final count is the number of matches.']],
  'while-sentinel-loops': ['Sentinel-controlled while loops', 'Trace a while loop whose condition depends on values updated inside the loop.', 'A sentinel loop repeats until a stopping value or condition appears.', 'text = input(); while text != "stop": text = input()', ['The first input is checked before repeating.', 'Any value except stop keeps the loop going.', 'The loop stops when text is stop.']],
  'nested-loops': ['Nested loops', 'Trace small nested loops without mixing up outer and inner variables.', 'The whole inner loop runs once for each outer-loop value.', 'for row in range(2): for col in range(3): print(row, col)', ['The outer loop has two row values.', 'For each row, the inner loop has three col values.', 'The print runs six total times.']],
  'calling-builtins': ['Calling built-in functions', 'Trace built-in calls and distinguish returned values from printed output.', 'A function call receives arguments and produces a result. That result is not visible unless it is printed or otherwise used.', 'length = len("python"); print(length)', ['len receives the string argument.', 'It returns 6.', 'print displays the stored result.']],
  'defining-functions': ['Defining functions', 'Trace control into a user-defined function and back to the caller.', 'A function definition names reusable behavior. The body runs only when the function is called.', 'def double(x): return x * 2; result = double(4)', ['The call double(4) starts the function.', 'Inside the function, x is 4.', 'The return value 8 is stored in result.']],
  'parameters-and-return-values': ['Parameters and return values', 'Predict function results for different argument values.', 'Parameters receive call inputs. return sends a value back to the caller.', 'def add_tax(price): return price * 1.1', ['price is a parameter.', 'Each call gives price a concrete value.', 'The returned value is available to the caller.']],
  'local-scope': ['Local scope', 'Distinguish local names from names in the caller.', 'Names created inside a function belong to that function call.', 'def f(x): y = x + 1; return y', ['x and y are local to the function call.', 'The caller receives only the returned value.', 'Local names disappear after the call finishes.']],
  'function-design': ['Function design', 'Plan a function with a purpose statement, parameters, return value, and tests.', 'A good function has one clear job and enough tests to show how it should behave.', 'def is_passing(score): return score >= 60', ['The name describes the question answered.', 'The parameter is the value being checked.', 'Useful tests include values below, at, and above the boundary.']],
  'strings-indexing': ['String indexing and slicing', 'Predict characters and substrings produced by indexing and slicing.', 'Indexing selects one character. Slicing selects a range that stops before the end index.', 'word = "python"; word[1:4]', ['Index 1 is y.', 'The slice includes positions 1, 2, and 3.', 'The result is "yth".']],
  'string-search-and-parsing': ['String search and parsing', 'Use common string methods to parse small text inputs.', 'Parsing turns one raw text value into structured pieces a program can inspect.', 'line = "Ada,42"; name, score = line.split(",")', ['split uses the comma as a separator.', 'The first field becomes name.', 'The second field becomes score text.']],
  'list-basics': ['List basics', 'Trace indexing, append, replacement, and simple list mutation.', 'Lists store ordered collections and can be changed after creation.', 'scores = [8, 9]; scores.append(10); scores[0] = 7', ['append adds a final element.', 'Assignment to index 0 replaces the first element.', 'The final list is [7, 9, 10].']],
  'traversing-sequences': ['Traversing sequences', 'Combine loops with strings and lists to compute small results.', 'Traversal visits one item at a time so the program can search, count, or summarize.', 'total = 0; for value in [2, 4, 6]: total += value', ['The loop visits 2, then 4, then 6.', 'Each value is added to total.', 'The final total is 12.']],
  'list-mutation-patterns': ['List mutation patterns', 'Choose safe list update patterns for small transformations.', 'Some tasks update a list in place. Others are clearer when they build a new list.', 'evens = []; for n in nums: if n % 2 == 0: evens.append(n)', ['Start with an empty result list.', 'Inspect each original value.', 'Append only values that satisfy the condition.']],
  'dictionary-lookup': ['Dictionary lookup', 'Trace reading, adding, and updating key-value pairs.', 'A dictionary maps keys to values so a program can look up the value for a meaningful key.', 'ages = {"Ada": 36}; ages["Grace"] = 30', ['Ada maps to 36.', 'A new key Grace is added.', 'A lookup by key retrieves one associated value.']],
  'frequency-tables': ['Frequency tables', 'Build and trace dictionary counting loops.', 'A frequency table counts how often each value appears.', 'counts = {}; for ch in "aba": counts[ch] = counts.get(ch, 0) + 1', ['a starts at 0 and becomes 1.', 'b starts at 0 and becomes 1.', 'a appears again and becomes 2.']],
  'nested-records': ['Nested records', 'Model records and collections of records with nested data.', 'A record groups related fields. A list can hold many records.', 'student = {"name": "Ada", "scores": [9, 10]}', ['name stores one text field.', 'scores stores a list field.', 'The dictionary keeps related data together.']],
  'reading-text-files': ['Reading text files', 'Reason about reading lines and cleaning newline characters.', 'File input lets programs process data larger than a typed example.', 'for line in file: clean = line.strip()', ['Each loop iteration reads one line.', 'strip removes surrounding whitespace and newlines.', 'The cleaned line is ready for parsing.']],
  'parsing-records': ['Parsing records', 'Split simple rows into fields and summarize the resulting records.', 'Parsing should turn raw text into values with useful names and types.', 'row = "Ada,36"; name, age_text = row.split(","); age = int(age_text)', ['split separates the two fields.', 'age_text is still a string.', 'int converts the age field for numeric use.']],
  'reading-tracebacks': ['Reading tracebacks', 'Use an error message to classify the likely problem.', 'A traceback tells where execution failed and what kind of failure occurred.', 'NameError: name total is not defined', ['The error category is NameError.', 'The program used a name Python could not find.', 'The likely fix is to define or spell the name correctly.']],
  'assertions-and-test-cases': ['Assertions and test cases', 'Choose normal and edge test cases for small functions.', 'Tests turn expected behavior into executable checks.', 'assert is_even(4) == True', ['The input is concrete.', 'The expected output is explicit.', 'A failing assertion points to behavior that needs investigation.']],
  'debugging-hypotheses': ['Debugging with hypotheses', 'Approach a bug with reproduce, isolate, inspect, fix, and verify.', 'A hypothesis should predict what evidence you expect to see next.', 'A counter ends at 1 instead of 3.', ['Reproduce the bug with the smallest input that shows it.', 'Inspect the counter after each update.', 'Fix one cause and verify the same case now passes.']],
  'exceptions-basics': ['Exception basics', 'Identify when simple exception handling is appropriate.', 'Use try/except around the operation that may fail, not around an entire program by habit.', 'try: value = int(text) except ValueError: value = None', ['The conversion is the risky operation.', 'ValueError handles text that is not an integer.', 'The fallback value makes the failure explicit.']],
  'edge-case-design': ['Edge case design', 'Identify empty, minimal, boundary, and surprising inputs.', 'Edge cases are inputs at the boundary of what a program claims to handle.', 'average([])', ['An empty list has no total divided by count.', 'The function needs a defined policy for this case.', 'A test should document that policy.']],
  'linear-search': ['Linear search', 'Trace a simple search and identify when it can stop.', 'Linear search checks items one at a time until a target is found or the data ends.', 'for item in items: if item == target: return True', ['Each item is compared with the target.', 'A match returns True immediately.', 'If no item matches, the search finishes and returns False.']],
  'sorting-and-runtime': ['Sorting and runtime intuition', 'Reason about sorted order and compare simple runtime growth.', 'Algorithms can produce the same answer while doing different amounts of work.', 'A loop over n items inside another loop over n items does about n times n checks.', ['One loop gives work proportional to n.', 'A nested pair of loops can give work proportional to n squared.', 'For large inputs, that difference becomes important.']],
  'recursion-base-cases': ['Recursive base cases', 'Identify the base case and the smaller recursive step.', 'A recursive function needs a case that stops without another recursive call.', 'def countdown(n): if n == 0: return "done"; return countdown(n - 1)', ['n == 0 is the base case.', 'n - 1 makes progress toward that case.', 'Without the base case, calls would continue forever.']],
  'recursive-tracing': ['Recursive tracing', 'Trace simple recursion through calls and returned values.', 'Recursive calls pause while smaller calls compute their results.', 'def fact(n): if n == 1: return 1; return n * fact(n - 1)', ['fact(3) waits for fact(2).', 'fact(2) waits for fact(1).', 'The returns unwind as 1, then 2, then 6.']],
  'simple-classes': ['Simple classes', 'Trace simple attributes and method calls on one object.', 'Classes bundle related state with behavior that operates on that state.', 'class Counter: value starts at 0; increment adds 1', ['The object stores value as an attribute.', 'increment updates that attribute.', 'The state stays with the object between method calls.']],
  'integration-project-planning': ['Integration project planning', 'Plan a multi-function program before writing the full implementation.', 'A small project combines data representation, helper functions, main flow, and tests.', 'A grade summary program reads rows, parses scores, computes totals, and reports results.', ['Choose how each row becomes structured data.', 'Write helpers for parsing and summarizing.', 'Test each helper before connecting the full flow.']]
}

const lessonPractice = {
  'read-sequential-programs': ['What does `print("set"); print("go")` display?', 'The first print displays set. The second print displays go.'],
  'tracking-variables': ['`coins = 4`; then `coins = coins + 2`. What is the final value?', 'coins = 6'],
  'expressions-and-types': ['Evaluate `value = 5 * 2; label = "ML" + "1"`.', 'value is the integer 10. label is the string "ML1".'],
  'console-input-output': ['The user enters `7`; then the program runs `age = int(input()); print(age + 1)`. What is printed?', 'The input text is converted to integer 7, so the program prints 8.'],
  'program-state-snapshots': ['After `x = 3; y = x + 4; x = 10`, what are `x` and `y`?', 'x is 10 and y is 7 because y does not change when x is reassigned.'],
  'relational-and-logical-expressions': ['Evaluate `age = 70; age >= 18 and age < 65`.', 'age >= 18 is true, age < 65 is false, so the whole expression is false.'],
  'boolean-branches': ['For `score = 8`, which branch runs in `if score > 10: print("high") else: print("low")`?', 'score > 10 is false, so the else branch runs and prints low.'],
  'multi-way-selection': ['For `points = 92`, what grade is assigned by checks for `>= 90` then `>= 80`?', 'The first condition is true, so grade becomes "A" and later checks are skipped.'],
  'input-validation': ['What should happen when `minutes = -3` and the guard is `if minutes < 0: print("invalid")`?', 'The guard condition is true, so the program prints invalid.'],
  'loop-tracing': ['Trace `total = 0; for n in [2, 3, 4]: total = total + n`. What is `total`?', 'total becomes 2, then 5, then 9. The final value is 9.'],
  'counted-loops': ['What values does `for i in range(1, 4): print(i)` print?', 'range starts at 1 and stops before 4, so it prints 1, 2, and 3.'],
  'accumulators-and-counters': ['For words `["yes", "no", "yes"]`, how many times does a counter increase when counting `"yes"`?', 'The counter increases for the first and third items, so the final count is 2.'],
  'while-sentinel-loops': ['A sentinel loop reads `"go"` and then `"stop"`. When does it stop?', 'It repeats after "go" and stops when the value becomes "stop".'],
  'nested-loops': ['How many times does `for row in range(2): for col in range(2): print(row, col)` print?', 'The inner loop runs 2 times for each of 2 rows, so it prints 4 times.'],
  'calling-builtins': ['What does `length = len("data"); print(length)` display?', 'len("data") returns 4, so print displays 4.'],
  'defining-functions': ['For `def double(x): return x * 2; result = double(5)`, what is `result`?', 'The call gives x the value 5, returns 10, and stores 10 in result.'],
  'parameters-and-return-values': ['If `def add_tax(price): return price * 1.1`, what does `add_tax(20)` return?', 'price is 20, so the function returns 22.0.'],
  'local-scope': ['For `def f(x): y = x + 2; return y; result = f(3)`, what can the caller use?', 'The caller can use result, which is 5. y was local to the function call.'],
  'function-design': ['For `def is_passing(score): return score >= 60`, what are `is_passing(59)` and `is_passing(60)`?', 'is_passing(59) is False and is_passing(60) is True.'],
  'strings-indexing': ['What is `word = "python"; word[0:2]`?', 'The slice includes indexes 0 and 1, so the result is "py".'],
  'string-search-and-parsing': ['For `line = "Grace,99"; name, score = line.split(",")`, what are the fields?', 'name is "Grace" and score is the text "99".'],
  'list-basics': ['After `scores = [1, 2]; scores.append(3); scores[1] = 9`, what is `scores`?', 'append adds 3, then index 1 is replaced, so scores is [1, 9, 3].'],
  'traversing-sequences': ['Trace summing `[1, 3, 5]`. What is the final total?', 'The total becomes 1, then 4, then 9. The final total is 9.'],
  'list-mutation-patterns': ['If `nums = [1, 2, 4]`, what list is built by appending only even values?', '2 and 4 satisfy the condition, so the new list is [2, 4].'],
  'dictionary-lookup': ['After `ages = {"Ada": 36}; ages["Grace"] = 30`, what is `ages["Grace"]`?', 'The key "Grace" maps to 30, so the lookup returns 30.'],
  'frequency-tables': ['Build counts for `"abb"`. What are the counts?', 'a appears once and b appears twice, so the counts are {"a": 1, "b": 2}.'],
  'nested-records': ['For `student = {"name": "Grace", "scores": [8, 9]}`, what does the `scores` field store?', 'The scores field stores the list [8, 9].'],
  'reading-text-files': ['If a file line is `"Ada\\n"`, what does `line.strip()` produce?', 'strip removes the newline, so the cleaned text is "Ada".'],
  'parsing-records': ['For `row = "Grace,30"`, what values come from splitting and converting the age?', 'name is "Grace" and the converted age is the integer 30.'],
  'reading-tracebacks': ['What does `NameError: name total is not defined` usually mean?', 'The program used the name total before Python could find a defined value for it.'],
  'assertions-and-test-cases': ['What does `assert is_even(6) == True` test?', 'It tests the concrete input 6 and expects the output True.'],
  'debugging-hypotheses': ['A counter ends at 2 instead of 3. What should you inspect first?', 'Reproduce the smallest failing case and inspect the counter after each update.'],
  'exceptions-basics': ['If `text = "abc"` and the program tries `int(text)` inside `try`, what happens?', 'int("abc") raises ValueError, so the matching except block handles the failure.'],
  'edge-case-design': ['Why is `average([])` an edge case?', 'An empty list has no count to divide by, so the function needs a defined policy and a test for it.'],
  'linear-search': ['For items `[3, 5, 7]` and target `5`, what does linear search return?', 'It checks 3, then finds 5 and returns True.'],
  'sorting-and-runtime': ['About how many checks can two nested loops over 10 items each perform?', 'The work is about 10 times 10, so about 100 checks.'],
  'recursion-base-cases': ['Why does `countdown(2)` eventually stop when the base case is `n == 0`?', 'The calls use 2, then 1, then 0, and the base case returns without another recursive call.'],
  'recursive-tracing': ['What is `fact(4)` when `fact(n)` returns `n * fact(n - 1)` and `fact(1)` is 1?', 'The returns multiply as 1, then 2, then 6, then 24. fact(4) is 24.'],
  'simple-classes': ['A Counter starts at 0 and `increment` runs twice. What is its value?', 'Each increment adds 1, so the stored value is 2.'],
  'integration-project-planning': ['For a grade summary program, what pieces should be planned before the full implementation?', 'Plan row parsing, score representation, summary helpers, main flow, and tests before combining them.']
}

const cs1Course = curriculum.courses.find((course) => course.id === 'computational-thinking-core')
const cs1ModuleIds = new Set(cs1Course?.moduleIds ?? [])
const cs1Modules = curriculum.modules.filter((module) => cs1ModuleIds.has(module.id))
const cs1SkillIds = new Set(cs1Modules.flatMap((module) => module.skillIds))
const cs1Skills = curriculum.skills.filter((skill) => cs1SkillIds.has(skill.id))

const lessonToModule = new Map(cs1Modules.flatMap((module) => module.lessonIds.map((id) => [id, module.id])))
const skillsByLesson = new Map()
for (const skill of cs1Skills) {
  for (const lessonId of skill.lessonIds) {
    skillsByLesson.set(lessonId, [...(skillsByLesson.get(lessonId) ?? []), skill])
  }
}

const specialAssessmentIds = {
  'read-sequential-programs': 'assessment-read-sequential-programs',
  'tracking-variables': 'assessment-tracking-variables',
  'boolean-branches': 'assessment-boolean-branches',
  'loop-tracing': 'assessment-loop-tracing',
  'debugging-hypotheses': 'assessment-debugging-hypotheses'
}

function assessmentIdForLesson(lessonId) {
  return specialAssessmentIds[lessonId] ?? `assessment-${lessonId}`
}

const lessons = cs1Modules.flatMap((module) => module.lessonIds.map((lessonId) => {
  const [title, objective, focus, example, steps] = lessonFocus[lessonId]
  const summary = focus
  const skills = skillsByLesson.get(lessonId) ?? []
  const taught = new Set(skills.map((skill) => skill.id))
  const prerequisites = [...new Set(skills.flatMap((skill) => skill.prerequisiteSkillIds))].filter((id) => !taught.has(id))
  return {
    id: lessonId,
    moduleId: lessonToModule.get(lessonId),
    title,
    summary,
    objective,
    estimatedMinutes: skills.length > 1 ? 16 : 12,
    skillIds: [...taught],
    prerequisiteSkillIds: prerequisites,
    sections: [{ id: `${lessonId}-lesson`, title: 'Lesson', body: [`${focus} To solve this kind of question, use the concrete value or program state given in the question, apply the rule shown in the worked example one step at a time, and choose the answer that matches the final traced result.`] }],
    workedExamples: [{ id: `${lessonId}-example-1`, prompt: example, steps: [steps.join(' ')] }],
    assessmentId: assessmentIdForLesson(lessonId),
    metadata: { author: 'core-team', status: 'complete' }
  }
}))

function practiceForLesson(lesson) {
  return lessonPractice[lesson.id] ?? [
    `Which answer correctly applies this lesson objective: ${lesson.objective}`,
    lesson.workedExamples[0].steps[0]
  ]
}

function optionsForPractice(solution) {
  return [
    solution,
    'This answer skips the concrete trace and guesses from names only.',
    'This answer changes an unrelated value instead of following the worked-example rule.'
  ]
}

function lessonAssessment(lesson) {
  const skills = lesson.skillIds.map((id) => curriculum.skills.find((skill) => skill.id === id))
  const primary = skills[0]
  const [question, solution] = practiceForLesson(lesson)
  const options = optionsForPractice(solution)
  return {
    id: lesson.assessmentId,
    type: 'lesson-check',
    title: `Lesson check: ${lesson.title}`,
    description: `Choose the answer that applies this lesson's procedure to a new case.`,
    skillIds: lesson.skillIds,
    lessonId: lesson.id,
    items: [
      { id: `${lesson.id}-check-1`, skillId: primary.id, type: 'multiple-choice', prompt: question, options, correctAnswer: solution, explanation: solution }
    ],
    passRule: { minCorrect: 1, maxAttemptsBeforeReview: 2 },
    metadata: { difficulty: Math.max(...skills.map((skill) => skill.metadata.difficulty)), calculatorAllowed: false }
  }
}

const assessments = [{
  id: 'diagnostic-computational-thinking',
  type: 'diagnostic',
  title: 'Entry diagnostic',
  description: 'Checks early execution, state, branch, loop, and debugging readiness.',
  skillIds: ['read-sequential-program', 'track-variable-state', 'branch-on-boolean', 'trace-simple-loops', 'isolate-bug-with-hypothesis'],
  items: [
    { id: 'diag-seq-1', skillId: 'read-sequential-program', type: 'multiple-choice', prompt: 'Which statement best describes sequential program flow?', options: ['The computer randomly picks a suitable line', 'The computer executes instructions in a defined order', 'The computer only executes the last line'], correctAnswer: 'The computer executes instructions in a defined order', explanation: 'A sequential program follows the written execution order unless control flow changes it.' },
    { id: 'diag-var-1', skillId: 'track-variable-state', type: 'text', prompt: '`x = 2`; then `x = x + 5`. What is the final value of `x`?', placeholder: 'Final value', acceptedAnswers: ['7'], explanation: 'The old value 2 is read, 5 is added, and 7 is stored back into x.' },
    { id: 'diag-branch-1', skillId: 'branch-on-boolean', type: 'multiple-choice', prompt: 'If `score = 12` and the condition is `score > 10`, which branch runs?', options: ['The true branch', 'The false branch', 'Neither branch'], correctAnswer: 'The true branch', explanation: '12 is greater than 10, so the condition is true.' },
    { id: 'diag-loop-1', skillId: 'trace-simple-loops', type: 'text', prompt: '`total = 0`; then a loop adds `1`, `2`, and `3`. What is the final value of `total`?', placeholder: 'Final value', acceptedAnswers: ['6'], explanation: '0 + 1 + 2 + 3 = 6.' },
    { id: 'diag-debug-1', skillId: 'isolate-bug-with-hypothesis', type: 'multiple-choice', prompt: 'What is the best first move when a program gives the wrong answer?', options: ['Change many lines at once', 'Reproduce the bug and inspect the relevant state', 'Delete the whole module'], correctAnswer: 'Reproduce the bug and inspect the relevant state', explanation: 'A reproducible case and visible state make debugging evidence-based.' }
  ],
  passRule: { minCorrect: 3, maxAttemptsBeforeReview: 1 },
  metadata: { difficulty: 0.28, calculatorAllowed: false }
}, ...lessons.map(lessonAssessment)]

const reviews = []
for (const skill of cs1Skills) {
  const assessmentId = `review-assessment-${skill.id}`
  assessments.push({
    id: assessmentId,
    type: 'review',
    title: `Review: ${skill.title}`,
    description: `Short review for ${skill.title.toLowerCase()}.`,
    skillIds: [skill.id],
    items: [{ id: `review-${skill.id}-1`, skillId: skill.id, type: 'multiple-choice', prompt: `What is the safest way to keep ${skill.title.toLowerCase()} reliable?`, options: ['Work from concrete values and check each step', 'Skip directly to the answer', 'Change unrelated code until something works'], correctAnswer: 'Work from concrete values and check each step', explanation: 'Concrete values and small checks make reasoning inspectable.' }],
    passRule: { minCorrect: 1 },
    metadata: { difficulty: skill.metadata.difficulty, calculatorAllowed: false }
  })
  reviews.push({ id: skill.reviewIds[0], skillId: skill.id, title: `Review for ${skill.title}`, assessmentId, initialIntervalDays: Math.max(2, Math.round(2 + skill.metadata.difficulty * 5)) })
}

const ownedLessonIds = new Set(lessons.map((lesson) => lesson.id))
const ownedAssessmentIds = new Set(assessments.map((assessment) => assessment.id))
const ownedReviewIds = new Set(reviews.map((review) => review.id))

curriculum.lessons = [...curriculum.lessons.filter((lesson) => !ownedLessonIds.has(lesson.id)), ...lessons]
curriculum.assessments = [
  ...curriculum.assessments.filter((assessment) => !ownedAssessmentIds.has(assessment.id)),
  ...assessments,
]
curriculum.reviews = [...curriculum.reviews.filter((review) => !ownedReviewIds.has(review.id)), ...reviews]
writeFileSync(path, `${JSON.stringify(curriculum, null, 2)}\n`)
