const OpenAI = require('openai');

require('dotenv').config({ path: __dirname + '/../.env' })

const { OPENAI_API_KEY } = process.env; // OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';

//Create a Class to handle ChatGpt Recommendations
class OpenAIRecommendation {
    constructor() {
        this.openai = new OpenAI({
            apiKey: OPENAI_API_KEY, // This is the default and can be omitted
        });
    }
//Method that gets a title description and multiple lessons and gives back a recommendation
    async getRecommendation(title, description, lessons) {
        const prompt = `Para el siguiente curso y para cada una de sus lecciones, 
                        haz una recomendación en relación a 
                        Contenidos, Actividades, Tipos de recursos (Videos, presentaciones etc) y evaluaciones:
                        \n
                        Title: ${title}\n
                        Description: ${description}\n
                        Lessons:\n
                        ${lessons.join('\n')}`;
        
        const completion = await this.openai.chat.completions.create({
        messages: [
            { role: "user", 
            content: prompt,
            },
        ],
        model: "gpt-3.5-turbo",      
    });
    
    const formattedResponse = completion.choices[0].message.content.replace(/\n/g, '<br>');
    console.log(formattedResponse);
    return formattedResponse
    }
}

module.exports = OpenAIRecommendation;

// Test de Class
//const recommendation = new OpenAIRecommendation();
//recommendation.getRecommendation('Curso de programación', 'Este es un curso de programación', ['Lección 1', 'Lección 2', 'Lección 3']);
