import { serviceApi } from "../serviceApi";

export interface AIModel {
  id: string;
  name: string;
  content: string;
  maxTokens: number;
  isActive: boolean;
}

export interface AIContentSettings {
  id: string;
  name: string;
  maxTokens: number;
  content: string;
  title: string;
  modelId: string;
  modelName: string;
  isActive?: boolean;
}

export const getAIModels = async () => {
  return await serviceApi("GET", "/models");
};

export const updateModalSetings = async (body: AIContentSettings) => {
  return await serviceApi("PUT", "/models", body);
};
export const getAIModelsSettings = async (): Promise<AIModel[]> => {
  const res = await serviceApi("GET", "/models/settings");
  if (res && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
};

// Ai Model Created Settings
export const createAiModels = async (
  modelId: string,
  title: string,
  content: string,
  maxTokens: number
) => {
  return await serviceApi("POST", "/models", {
    modelId,
    title,
    content,
    maxTokens,
  });
};

// AI Added GET Models
export const getAddedModels = async () => {
  return await serviceApi("GET", "/preset-models");
};

// Update Added Model
export const updateAddedModel = async (
  id: string,
  modelId: string,
  title: string,
  content: string,
  maxTokens: number
) => {
  return await serviceApi("PUT", "/models", {
    id,
    modelId,
    title,
    content,
    maxTokens,
  });
};

// Delete Added Settings Model 
export const deleteAddedModel = async (id: string) => {
  return await serviceApi("DELETE", `/preset-models/${id}`);
};

// Chat List (history)
export const getChatList = async () => {
  return await serviceApi("GET", "/chats");
};

// Chat By Id
export const getChatHistoryById = async (chatId: string) => {
  return await serviceApi("GET", `/chats/${chatId}`);
};

// Chat List Title edit
export const updateChatTitle = async (id: string, title: string) => {
  return await serviceApi("PUT", "/chat/update", { id, title });
};

// Chat List Title delete
export const deleteChatTitle = async (id: string) => {
  return await serviceApi("DELETE", `/chat/${id}`);
};
