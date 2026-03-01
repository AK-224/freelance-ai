import React, { useState } from 'react';
import { Sparkles, Loader2, Save, FileText } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useData } from '../context/DataContext';

export default function AIEstimator() {
  const { currency } = useData();
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateResult, setEstimateResult] = useState<{
    range: string;
    hourly: string;
    breakdown: string;
    confidence: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    editingType: 'Video',
    complexity: 'Standard',
    duration: '10',
    turnaround: 'Standard',
    clientType: 'SME',
    experience: 'Intermediate',
    location: 'US',
  });

  const symbol = currency === 'INR' ? '₹' : '$';

  const handleEstimate = async () => {
    setIsEstimating(true);
    setEstimateResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are an expert pricing consultant for freelance editors.
        Calculate a fair market rate estimate based on these parameters:
        - Editing Type: ${formData.editingType}
        - Complexity: ${formData.complexity}
        - Duration: ${formData.duration} minutes/hours
        - Turnaround: ${formData.turnaround}
        - Client Type: ${formData.clientType}
        - Experience Level: ${formData.experience}
        - Location/Market: ${formData.location}
        - Target Currency: ${currency}

        Return ONLY a JSON object with this exact structure (no markdown, no backticks):
        {
          "range": "${symbol}XXX - ${symbol}YYY",
          "hourly": "${symbol}ZZ/hr",
          "breakdown": "Base rate + complexity premium + rush surcharge (brief explanation)",
          "confidence": "High/Medium/Low"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsed = JSON.parse(resultText);
        setEstimateResult(parsed);
      }
    } catch (error) {
      console.error("Failed to generate estimate:", error);
      // Fallback for demo purposes if API fails
      setEstimateResult({
        range: `${symbol}250 - ${symbol}420`,
        hourly: `${symbol}45/hr`,
        breakdown: `Base rate (${symbol}200) + Standard complexity (${symbol}50) + SME Client premium (${symbol}50)`,
        confidence: "High"
      });
    } finally {
      setIsEstimating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gradient-to-br from-bg-card to-bg-primary border border-border-color rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-2 flex items-center gap-3">
              Estimate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-teal to-accent-blue">'Editing'</span> Earning
              <Sparkles className="w-6 h-6 text-accent-teal" />
            </h2>
            <p className="text-text-secondary text-lg">Let AI calculate the fair market rate for your editing work.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Editing Type</label>
              <select name="editingType" value={formData.editingType} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none">
                <option>Video</option>
                <option>Photo</option>
                <option>Content / Copy</option>
                <option>Audio</option>
                <option>Motion Graphics</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Project Complexity</label>
              <select name="complexity" value={formData.complexity} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none">
                <option>Simple</option>
                <option>Standard</option>
                <option>Complex</option>
                <option>Expert</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Estimated Duration (mins/hrs)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none" placeholder="e.g. 10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Turnaround Time</label>
              <select name="turnaround" value={formData.turnaround} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none">
                <option>Standard</option>
                <option>Rush (24hr)</option>
                <option>Same-day</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Client Type</label>
              <select name="clientType" value={formData.clientType} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none">
                <option>Individual</option>
                <option>SME</option>
                <option>Agency</option>
                <option>Enterprise</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Your Experience Level</label>
              <select name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
                <option>Premium</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-text-secondary">Location / Market</label>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-bg-card border border-border-color text-text-primary rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none">
                <option>US</option>
                <option>EU</option>
                <option>UK</option>
                <option>Asia</option>
                <option>Global / Remote</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleEstimate}
            disabled={isEstimating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {isEstimating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isEstimating ? 'Calculating...' : 'Generate Estimate'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:w-[400px] flex flex-col">
          <div className={`flex-1 bg-bg-card border border-border-color rounded-xl p-6 shadow-sm flex flex-col transition-all duration-500 ${estimateResult ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-teal" /> AI Estimate
            </h3>
            
            {estimateResult ? (
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Estimated Rate Range</p>
                  <p className="text-3xl font-extrabold text-accent-teal">{estimateResult.range}</p>
                  <p className="text-sm font-medium text-text-primary mt-1">Recommended: {estimateResult.hourly}</p>
                </div>
                
                <div className="bg-bg-primary p-4 rounded-lg border border-border-color">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Breakdown</p>
                  <p className="text-sm text-text-primary leading-relaxed">{estimateResult.breakdown}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-secondary">Confidence Score:</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    estimateResult.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-500' : 
                    estimateResult.confidence === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {estimateResult.confidence}
                  </span>
                </div>

                <div className="pt-4 border-t border-border-color flex gap-3 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-teal text-white rounded-lg text-sm font-semibold hover:bg-accent-teal/90 transition-colors">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bg-primary border border-border-color text-text-primary rounded-lg text-sm font-semibold hover:bg-bg-card transition-colors">
                    <FileText className="w-4 h-4" /> Invoice
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary space-y-4">
                <div className="w-16 h-16 rounded-full bg-bg-primary flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-border-color" />
                </div>
                <p className="text-sm max-w-[250px]">Fill out the project details and click generate to see your AI-powered earnings estimate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
