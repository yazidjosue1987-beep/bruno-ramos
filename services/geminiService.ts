import { GoogleGenAI } from "@google/genai";
import { SchoolStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSchoolReport = async (stats: SchoolStats, recentAnnouncement: string): Promise<string> => {
  try {
    const prompt = `
      Actúa como un consultor educativo experto para el "Colegio Científico del Norte".
      
      Analiza los siguientes datos actuales del colegio:
      - Total Estudiantes: ${stats.totalStudents}
      - Total Docentes: ${stats.totalTeachers}
      - Promedio General de Notas: ${stats.averageGrade}/100
      - Tasa de Asistencia: ${stats.attendanceRate}%
      
      Último anuncio importante: "${recentAnnouncement}"

      Genera un reporte ejecutivo breve (máximo 200 palabras) en formato Markdown.
      El reporte debe incluir:
      1. Un análisis del rendimiento académico.
      2. Una sugerencia estratégica para mejorar.
      3. Un tono profesional y motivador.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar el reporte en este momento.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error al conectar con el servicio de IA. Por favor verifique su conexión o intente más tarde.";
  }
};
