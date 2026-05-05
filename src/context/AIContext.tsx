import React, { createContext, useContext, useState, useEffect } from 'react';

export type AIModel = 'anthropic' | 'openai' | 'gemini';

interface AIKeys {
  anthropic: string;
  openai: string;
  gemini: string;
  [key: string]: string;
}

interface AIContextType {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  aiKeys: AIKeys;
  setAiKeys: (keys: AIKeys) => void;
  saveKeys: (keys: AIKeys) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>('anthropic');
  const [aiKeys, setAiKeys] = useState<AIKeys>({
    anthropic: '',
    openai: '',
    gemini: ''
  });

  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem('lynxis_ai_keys');
      if (savedKeys) {
        setAiKeys(JSON.parse(savedKeys));
      }
      const savedModel = localStorage.getItem('lynxis_selected_model');
      if (savedModel) {
        setSelectedModel(savedModel as AIModel);
      }
    } catch (e) {
      console.error('Failed to load saved AI settings:', e);
    }
  }, []);

  const saveKeys = (keys: AIKeys) => {
    setAiKeys(keys);
    localStorage.setItem('lynxis_ai_keys', JSON.stringify(keys));
  };

  useEffect(() => {
    localStorage.setItem('lynxis_selected_model', selectedModel);
  }, [selectedModel]);

  return (
    <AIContext.Provider value={{ selectedModel, setSelectedModel, aiKeys, setAiKeys, saveKeys }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
