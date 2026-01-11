# MetaPrompt Examples

See how MetaPrompt transforms simple prompts into professional, structured queries.

## Coding Examples

### Example 1: Array Sorting

**Before:**
```
write a function to sort an array
```

**After:**
```
You are an expert software engineer specializing in multiple programming languages.

Task: write a function to sort an array

Requirements:
- Write clean, efficient, and maintainable code
- Follow best practices and design patterns
- Include error handling where appropriate
- Add concise inline comments for complex logic
- Consider time and space complexity
- Handle edge cases

Output format:
1. Brief explanation of the approach
2. Complete implementation
3. Usage example
4. Time/Space complexity analysis (if applicable)
5. Potential improvements or considerations
```

**Impact:** Adds structure, asks for complexity analysis, requests examples and edge cases.

---

### Example 2: API Development

**Before:**
```
create a REST API for users
```

**After:**
```
You are an expert software engineer specializing in multiple programming languages.

Task: create a REST API for users

Requirements:
- Write clean, efficient, and maintainable code
- Follow best practices and design patterns
- Include error handling where appropriate
- Add concise inline comments for complex logic
- Consider time and space complexity
- Handle edge cases

Output format:
1. Brief explanation of the approach
2. Complete implementation
3. Usage example
4. Time/Space complexity analysis (if applicable)
5. Potential improvements or considerations
```

**Impact:** Ensures proper REST conventions, security considerations, and complete implementation.

---

## Debugging Examples

### Example 3: Null Pointer Error

**Before:**
```
fix my null pointer error
```

**After:**
```
You are an expert debugging specialist with systematic problem-solving skills.

Problem: fix my null pointer error

Debugging approach:
- Analyze the symptoms and error messages
- Identify the root cause
- Explain why the issue occurs
- Provide a clear solution
- Suggest preventive measures

Output format:
1. Problem Analysis
2. Root Cause
3. Solution (with code if applicable)
4. Explanation
5. Prevention tips
```

**Impact:** Guides the AI to provide systematic debugging help with prevention strategies.

---

### Example 4: Performance Issue

**Before:**
```
my code is running slow
```

**After:**
```
You are an expert debugging specialist with systematic problem-solving skills.

Problem: my code is running slow

Debugging approach:
- Analyze the symptoms and error messages
- Identify the root cause
- Explain why the issue occurs
- Provide a clear solution
- Suggest preventive measures

Output format:
1. Problem Analysis
2. Root Cause
3. Solution (with code if applicable)
4. Explanation
5. Prevention tips
```

**Impact:** Prompts for performance profiling, bottleneck identification, and optimization strategies.

---

## Explanation Examples

### Example 5: Neural Networks

**Before:**
```
explain how neural networks work
```

**After:**
```
You are an expert educator skilled at making complex topics accessible.

Topic: explain how neural networks work

Teaching approach:
- Start with a clear, simple definition
- Build understanding progressively
- Use analogies and real-world examples
- Address common misconceptions
- Provide practical applications

Output format:
1. Clear Definition
2. Core Concepts (step by step)
3. Examples
4. Common Misconceptions
5. Practical Applications
6. Further Learning Resources
```

**Impact:** Ensures educational, step-by-step explanation with examples and resources.

---

### Example 6: Blockchain Technology

**Before:**
```
what is blockchain
```

**After:**
```
You are an expert educator skilled at making complex topics accessible.

Topic: what is blockchain

Teaching approach:
- Start with a clear, simple definition
- Build understanding progressively
- Use analogies and real-world examples
- Address common misconceptions
- Provide practical applications

Output format:
1. Clear Definition
2. Core Concepts (step by step)
3. Examples
4. Common Misconceptions
5. Practical Applications
6. Further Learning Resources
```

**Impact:** Delivers structured learning with analogies and practical context.

---

## Writing Examples

### Example 7: Blog Post

**Before:**
```
write a blog post about AI
```

**After:**
```
You are an expert writer with exceptional communication skills.

Writing task: write a blog post about AI

Guidelines:
- Match the appropriate tone and style
- Structure content logically
- Use clear and engaging language
- Ensure proper grammar and flow
- Consider the target audience

Deliverable:
- Well-structured content
- Appropriate formatting
- Engaging and professional tone
```

**Impact:** Guides tone, structure, and audience consideration.

---

### Example 8: Professional Email

**Before:**
```
write an email to my boss about time off
```

**After:**
```
You are an expert writer with exceptional communication skills.

Writing task: write an email to my boss about time off

Guidelines:
- Match the appropriate tone and style
- Structure content logically
- Use clear and engaging language
- Ensure proper grammar and flow
- Consider the target audience

Deliverable:
- Well-structured content
- Appropriate formatting
- Engaging and professional tone
```

**Impact:** Ensures professional tone and proper email etiquette.

---

## Analysis Examples

### Example 9: Framework Comparison

**Before:**
```
compare React vs Vue
```

**After:**
```
You are an expert analyst with critical thinking and evaluation skills.

Analysis task: compare React vs Vue

Framework:
- Define evaluation criteria
- Examine all relevant aspects
- Consider strengths and weaknesses
- Support claims with reasoning
- Provide balanced perspective

Output structure:
1. Overview
2. Detailed Analysis
3. Key Findings
4. Comparison (if applicable)
5. Recommendations/Conclusions
```

**Impact:** Ensures balanced, criteria-based comparison with recommendations.

---

### Example 10: Technology Evaluation

**Before:**
```
should I use microservices
```

**After:**
```
You are an expert analyst with critical thinking and evaluation skills.

Analysis task: should I use microservices

Framework:
- Define evaluation criteria
- Examine all relevant aspects
- Consider strengths and weaknesses
- Support claims with reasoning
- Provide balanced perspective

Output structure:
1. Overview
2. Detailed Analysis
3. Key Findings
4. Comparison (if applicable)
5. Recommendations/Conclusions
```

**Impact:** Prompts for pros/cons analysis with context-specific recommendations.

---

## General Examples

### Example 11: Open-Ended Query

**Before:**
```
help me learn programming
```

**After:**
```
You are an expert assistant with deep knowledge across multiple domains.

Task: help me learn programming

Instructions:
- Provide a comprehensive and well-structured response
- Break down complex concepts into digestible parts
- Use examples where appropriate
- Consider edge cases and alternative perspectives
- Be precise and actionable

Format your response with clear sections and bullet points where helpful.
```

**Impact:** Adds structure and requests actionable, comprehensive guidance.

---

### Example 12: Complex Problem

**Before:**
```
improve my app's architecture
```

**After:**
```
You are an expert assistant with deep knowledge across multiple domains.

Task: improve my app's architecture

Instructions:
- Provide a comprehensive and well-structured response
- Break down complex concepts into digestible parts
- Use examples where appropriate
- Consider edge cases and alternative perspectives
- Be precise and actionable

Format your response with clear sections and bullet points where helpful.
```

**Impact:** Ensures systematic architectural review with concrete recommendations.

---

## Intent Detection

MetaPrompt automatically detects your intent based on keywords:

| Intent | Keywords | Template Applied |
|--------|----------|------------------|
| **Debugging** | debug, fix, error, broken, crash | Systematic debugging framework |
| **Coding** | write, create, function, code, implement | Software engineering best practices |
| **Explanation** | explain, what is, how does, describe | Educational teaching approach |
| **Analysis** | compare, analyze, evaluate, assess | Critical analysis framework |
| **Writing** | write, compose, blog, email, essay | Professional writing guidelines |
| **General** | (any other prompt) | Comprehensive assistant approach |

---

## Pro Tips

1. **Be Specific**: More detailed original prompts get better enhancements
2. **Include Context**: Mention your skill level, tech stack, or use case
3. **Try Variations**: See how different phrasings affect the enhancement
4. **Combine Intents**: "explain and write code for..." triggers coding template
5. **Use Examples**: Include input/output examples in your original prompt

---

## Before/After Comparison

### Average Enhancement Stats

- **Original Length**: 20-50 characters
- **Enhanced Length**: 400-600 characters
- **Words Added**: 60-90 words
- **Structure Added**: 5-7 sections
- **Improvement**: 800-1200% more detailed

---

## Testing Your Own Prompts

Use the included `test.html` file to experiment:

1. Open `test.html` in your browser
2. Enter your prompt
3. Click "Enhance Prompt"
4. See the transformation instantly
5. View detected intent and statistics

---

## Custom Use Cases

### For Students
- "explain calculus concepts" → Educational framework
- "help with essay structure" → Writing guidelines
- "debug my homework code" → Systematic debugging

### For Developers
- "optimize database query" → Coding best practices
- "review my architecture" → Analysis framework
- "explain design patterns" → Educational approach

### For Content Creators
- "write engaging intro" → Writing guidelines
- "analyze competitor content" → Analysis framework
- "brainstorm blog topics" → General comprehensive approach

### For Professionals
- "draft meeting summary" → Writing guidelines
- "compare vendor solutions" → Analysis framework
- "explain to stakeholders" → Educational approach

---

## Feedback

Found a prompt type that doesn't enhance well? Want to suggest a new template?

Contributions welcome! See the main README for contribution guidelines.
