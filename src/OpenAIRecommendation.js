const OpenAI = require('openai');

require('dotenv').config({ path: __dirname + '/../.env' })

const { OPENAI_API_KEY } = process.env;

//Create a Class to handle ChatGpt Recommendations
class OpenAIRecommendation {
        constructor() {
            this.openai = new OpenAI({
                apiKey: OPENAI_API_KEY, // This is the default and can be omitted
            });
         }

    async getRecommendation(title, description, lessons) {
        const promises = lessons.map(async (lesson) => {
            const lessonPrompt = `Para el curso ; ${title} de descripción: ${description}, en específico para la lección \n
                                  Lesson: ${lesson.title}\nLearning Objective: ${lesson.learningObjective}\n
                                  Haz una recomendación, siendo bien específico y con ejemplos reals sobre los mejores 
                                  contenidos, actividades, tipos de recursos (Videos, presentaciones etc), y evaluación a considerar 
                                  para el desarrollo óptimo de un curso basado en estos conceptos.
                                  La idea es que la experiencia del curso sea una experiencia increible.
                                  `;
            const combinedPrompt = `${title}\n\n${description}\n\n${lessonPrompt}`;

            const completion = await this.openai.chat.completions.create({
                messages: [{ role: "user", content: combinedPrompt }],
                model: "gpt-3.5-turbo",
            });

            const lessonrecommendation = completion.choices[0].message.content.replace(/\n/g, '<br>');
            return lessonrecommendation;
        });

        const responses = await Promise.all(promises);
        const formattedResponses = responses.map((response, index) => {
            return `\n\nRecomendaciones para la lección ${index + 1}: ${response}`;
        });

        const combinedResponse = formattedResponses.join('\n\n');
        console.log(combinedResponse);
        return combinedResponse;
    }
}

module.exports = OpenAIRecommendation;

// Test de Class
// const recommendation = new OpenAIRecommendation();
// const testcourse = {
//     "id": 6,
//     "title": "Liderando con Agilidad para Product Owners",
//     "courseObjective": " Objetivos del Curso:  Entender los Fundamentos de Scrum: Proporcionar una comprensión sólida de los principios y prácticas fundamentales de Scrum, centrándose en el rol del Product Owner.  Preparación para la Certificación: Preparar a los participantes para la certificación Scrum Fundamentals de Scrum Study, cubriendo los conceptos clave necesarios para el éxito en el examen.  Aplicación Práctica: Capacitar a los participantes para aplicar los principios de Scrum en su trabajo diario como Product Owners, maximizando el valor del producto y mejorando la colaboración con los equipos.",
//     "description": "Este curso está diseñado para profesionales que desempeñan o aspiran a desempeñar el rol de Product Owner en equipos Scrum. El público objetivo incluye:\n\nProfesionales de gestión de productos\nGerentes de proyectos\nAnalistas de negocios\nLíderes de equipo\nDesarrolladores de software interesados en entender mejor el rol de Product Owner\n\nDuración 3 horas.",
//     "lessons": [
//       {
//         "title": "Introducción a Scrum y el Rol del Product Owner",
//         "learningObjective": " Comprender los principios básicos de Scrum y el papel crucial del Product Owner en el marco de trabajo ágil."
//       },
//       {
//         "title": "Responsabilidades y Competencias del Product Owner",
//         "learningObjective": " Identificar las responsabilidades clave del Product Owner y desarrollar las competencias necesarias para desempeñar el rol de manera efectiva."
//       },
//       {
//         "title": "Gestión del Product Backlog",
//         "learningObjective": "Aprender las mejores prácticas para gestionar el Product Backlog, incluyendo la priorización de elementos y la comunicación efectiva con el equipo."
//       }
//     //   {
//     //     "title": "Colaboración y Comunicación",
//     //     "learningObjective": "Mejorar las habilidades de comunicación y colaboración para trabajar de manera eficiente con el equipo de desarrollo, stakeholders y otros miembros del equipo Scrum."
//     //   },
//     //   {
//     //     "title": "Maximización del Valor del Producto",
//     //     "learningObjective": "Entender cómo maximizar el valor del producto mediante la entrega incremental y continua, la retroalimentación del cliente y la adaptación a los cambios."
//     //   },
//     //   {
//     //     "title": "Preparación para la Certificación",
//     //     "learningObjective": "Proporcionar estrategias y consejos prácticos para prepararse y aprobar con éxito el examen de certificación Scrum Fundamentals de Scrum Study."
//     //   }
//     ],
//     "recommendationsDone": false,
//     "recommendations": [

//     ]
//   }

// recommendation.getRecommendation(testcourse.title, testcourse.description, testcourse.lessons).then(res => console.log(res))
