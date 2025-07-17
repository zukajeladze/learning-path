import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { skill } = await req.json();

    if (!skill) {
      return NextResponse.json({ error: 'Skill is required' }, { status: 400 });
    }

    const prompt = `Create a detailed learning path for "${skill}". Please provide a structured response with the following format:

    {
      "title": "Learning Path for ${skill}",
      "description": "Brief overview of what this learning path covers",
      "steps": [
        {
          "id": 1,
          "title": "Step title",
          "description": "What you'll learn in this step",
          "duration": "estimated time",
          "difficulty": "beginner/intermediate/advanced"
        }
      ]
    }

    Make sure to include 6-10 logical steps that progress from beginner to advanced level. Each step should build upon the previous ones.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const learningPath = JSON.parse(content.text);
        return NextResponse.json(learningPath);
      } catch (parseError) {
        // If JSON parsing fails, return a fallback structure
        return NextResponse.json({
          title: `Learning Path for ${skill}`,
          description: `A comprehensive guide to mastering ${skill}`,
          steps: [
            {
              id: 1,
              title: 'Getting Started',
              description: content.text.substring(0, 200) + '...',
              duration: '1-2 weeks',
              difficulty: 'beginner',
            },
          ],
        });
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
