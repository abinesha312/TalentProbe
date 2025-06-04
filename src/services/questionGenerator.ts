export const generateSurveyQuestions = async (jobPost: string): Promise<string[]> => {
  try {
    console.log("Calling OpenRouter API to generate questions...");
    
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not found in environment variables');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'RecruitMind AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: `You are an expert recruitment consultant. Your task is to analyze job postings and generate intelligent survey questions that recruiters should ask to gather additional context about the role, ideal candidate, company culture, and other important details not explicitly mentioned in the job posting.

Generate 8-12 specific, actionable questions that help recruiters:
1. Clarify responsibilities and expectations
2. Understand the ideal candidate profile beyond basic requirements
3. Learn about team dynamics and company culture
4. Identify deal-breakers or must-have qualities
5. Understand growth opportunities and career progression
6. Clarify compensation philosophy and benefits
7. Learn about challenges the role faces
8. Understand success metrics and performance evaluation

Format your response as a JSON array of strings, where each string is a complete, well-formed question. Each question should be conversational and designed to elicit detailed, useful responses from recruiters.`
          },
          {
            role: 'user',
            content: `Please analyze this job posting and generate personalized survey questions for the recruiter:

${jobPost}

Return only the JSON array of questions, no additional text.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenRouter API response:", data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    const content = data.choices[0].message.content;
    
    try {
      // Try to parse as JSON
      const questions = JSON.parse(content);
      if (Array.isArray(questions)) {
        return questions.filter(q => typeof q === 'string' && q.trim().length > 0);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback: extract questions from text
      const lines = content.split('\n').filter((line: string) => line.trim().length > 0);
      const questions = lines
        .map((line: string) => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
        .filter((line: string) => line.length > 10 && line.includes('?'));
      
      if (questions.length > 0) {
        return questions;
      }
    }

    // Final fallback
    return [
      "What specific day-to-day responsibilities would you say are most critical for success in this role?",
      "Beyond the technical skills listed, what soft skills or personality traits are essential for this position?",
      "How would you describe the team dynamics and collaboration style for this role?",
      "What are the biggest challenges someone in this position typically faces?",
      "What does career progression look like for someone starting in this role?",
      "How do you measure success and performance for this position?",
      "What aspects of your company culture are most important for this role?",
      "Are there any deal-breakers or red flags you watch out for when interviewing candidates?"
    ];

  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
