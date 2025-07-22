import { serviceApi } from "../serviceApi";

export interface AIModel {
  id: string;
  created: number;
  object: string;
  owned_by: string;
  meta: any;
}

interface AIContentSettings {
  id: string;
  name: string;
  maxTokens: number;
  content: string;
  isActive?: boolean;
}

export const getAIModels = async () => {
  return await serviceApi("GET", "/models");
};
export const getAIModelsSettings = async () => {
  return await serviceApi("GET", "/models/settings");
};

export const updateModalSetings = async (body: AIContentSettings) => {
  return await serviceApi("PUT", "/models", body);
};



// Chat List (history)

export const getChatList = async () => {
  return await serviceApi('GET', '/chats')
}