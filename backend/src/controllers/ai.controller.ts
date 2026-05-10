import { Request, Response } from 'express';
import Groq from 'groq-sdk';

export const generateTrip = async (req: Request, res: Response) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    const { destination, days, budget, travelStyle, interests } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ success: false, message: 'Destination and duration are required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API Key is not configured' });
    }

    const prompt = `
      You are an intelligent AI travel planner.
      Generate a detailed personalized travel itinerary based on the following inputs:

      Destination: ${destination}
      Trip Duration: ${days} days
      Budget: ${budget}
      Travel Style: ${travelStyle}
      Interests: ${interests}

      Requirements:
      - Create a day-wise itinerary
      - Suggest cities/places to visit
      - Suggest activities for each day
      - Include estimated costs
      - Include food recommendations
      - Include travel tips
      - Keep the plan realistic within budget
      - Balance relaxation and activities
      - Return structured JSON only

      JSON Format:
      {
        "tripTitle": "",
        "totalEstimatedBudget": "",
        "days": [
          {
            "day": 1,
            "city": "",
            "activities": [
              {
                "title": "",
                "time": "",
                "estimatedCost": "",
                "description": ""
              }
            ],
            "foodSuggestions": [],
            "dailyBudget": ""
          }
        ],
        "travelTips": []
      }

      Do not return markdown backticks or any text other than the JSON object.
      Return clean JSON only.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';
    
    try {
      const itinerary = JSON.parse(responseText);
      res.json({ success: true, itinerary });
    } catch (e) {
      console.error('JSON Parse Error:', responseText);
      res.status(500).json({ success: false, message: 'AI returned invalid JSON structure' });
    }
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

import Trip from '../models/Trip';

export const saveAiTrip = async (req: Request, res: Response) => {
  try {
    const { itinerary } = req.body;
    if (!itinerary) return res.status(400).json({ success: false, message: 'Itinerary is required' });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + itinerary.days.length);

    const trip = await Trip.create({
      user: req.user!.userId,
      title: itinerary.tripTitle,
      startDate,
      endDate,
      status: 'upcoming',
      stops: itinerary.days.map((day: any, idx: number) => ({
        city: day.city,
        country: itinerary.tripTitle.split(' ').pop() || 'Unknown',
        arrivalDate: new Date(startDate.getTime() + idx * 86400000),
        departureDate: new Date(startDate.getTime() + (idx + 1) * 86400000),
        activities: day.activities.map((act: any) => ({
          name: act.title,
          description: act.description,
          startTime: act.time,
          cost: parseFloat(act.estimatedCost.replace(/[^0-9.]/g, '')) || 0,
          category: 'Sightseeing'
        }))
      }))
    });

    res.json({ success: true, tripId: trip._id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
