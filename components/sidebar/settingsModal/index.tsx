/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Settings,
  Save,
  X,
  AlertTriangle,
  Loader2,
  Trash2,
  Brain,
  Zap,
  Edit,
  Bot,
  ChevronRight,
} from "lucide-react";
import {
  getAIModelsSettings,
  createAiModels,
  AIModel,
  AIContentSettings,
  getAddedModels,
  deleteAddedModel,
  updateAddedModel,
} from "@/service/chat";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ModelFormData {
  id: string | null;
  title: string;
  modelId: string;
  modelName: string;
  content: string;
  maxTokens: string;
}

const initialFormData: ModelFormData = {
  id: null,
  title: "",
  modelId: "",
  modelName: "",
  content: "",
  maxTokens: "",
};

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [addedModels, setAddedModels] = useState<AIContentSettings[]>([]);
  const [availableBaseModels, setAvailableBaseModels] = useState<AIModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ModelFormData>(initialFormData);

  const [originalFormData, setOriginalFormData] =
    useState<ModelFormData>(initialFormData);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [baseModels, userModels] = await Promise.all([
        getAIModelsSettings(),
        getAddedModels(),
      ]);
      setAvailableBaseModels(baseModels);
      setAddedModels(userModels.data);
    } catch (error) {
      console.error("Modellarni yuklashda xatolik:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  useEffect(() => {
    if (isAdding) {
      setSelectedModelId(null);
      setFormData(initialFormData);
    } else {
      const selected = addedModels.find((m) => m.id === selectedModelId);
      if (selected) {
        const currentData = {
          id: selected.id,
          title: selected.title,
          modelId: selected.modelId,
          modelName: selected.modelName,
          content: selected.content || "",
          maxTokens: selected.maxTokens?.toString() || "",
        };
        setFormData(currentData);
        setOriginalFormData(currentData);
      } else {
        setFormData(initialFormData);
        setOriginalFormData(initialFormData);
      }
    }
  }, [selectedModelId, isAdding, addedModels]);

  const handleFormChange = (
    field: keyof Omit<ModelFormData, "modelName">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBaseModelChange = (modelId: string) => {
    const selectedBaseModel = availableBaseModels.find((m) => m.id === modelId);
    setFormData((prev) => ({
      ...prev,
      modelId: modelId,
      modelName: selectedBaseModel?.name || "",
    }));
  };

  const handleSelectModel = (modelId: string) => {
    setIsAdding(false);
    setSelectedModelId(modelId);
  };

  const handleStartAdding = () => {
    setIsAdding(true);
    setSelectedModelId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedModelId(null);
    setFormData(initialFormData);
  };

  const handleDeleteModel = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Haqiqatan ham bu modelni o'chirmoqchimisiz?")) {
      setIsLoading(true);
      try {
        await deleteAddedModel(id);
        setAddedModels((prev) => prev.filter((model) => model.id !== id));
        if (selectedModelId === id) {
          handleCancel();
        }
      } catch (error) {
        console.error("Modelni o'chirishda xatolik:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!formData.title.trim()) {
        alert("Iltimos, model nomini kiriting.");
        setIsLoading(false);
        return;
      }

      if (isAdding) {
        if (!formData.modelId) {
          alert("Iltimos, asosiy modelni tanlang.");
          setIsLoading(false);
          return;
        }
        await createAiModels(
          formData.modelId,
          formData.title,
          formData.content,
          Number(formData.maxTokens),
          // formData.modelName
        );
      } else {
        if (!formData.id) return;
        await updateAddedModel(
          formData.id,
          formData.modelId,
          formData.title,
          formData.content,
          Number(formData.maxTokens)
        );
      }

      await fetchData();
      handleCancel();
    } catch (err) {
      console.error("Sozlamalarni saqlashda xatolik:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  const showEditPanel = isAdding || selectedModelId;

  const isFormDirty =
    JSON.stringify(formData) !== JSON.stringify(originalFormData);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-7xl w-[90vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-900 border-slate-800">
        <DialogHeader className="px-8 py-2 bg-slate-950/70 backdrop-blur-sm border-b border-slate-800">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl text-white shadow-lg">
              <Brain className="w-6 h-6" />
            </div>
            AI Model Sozlamalari
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* colum 1 */}
          <div className="w-1/2 bg-slate-800/50 backdrop-blur-sm border-r border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <Button
                onClick={handleStartAdding}
                disabled={isAdding}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5 mr-2" /> Model Qo'shish
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-slate-300">
                  Qo'shilgan Modellar
                </h4>
                <div className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-semibold">
                  {addedModels.length}
                </div>
              </div>
              <div className="space-y-3">
                {addedModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    className={`group p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedModelId === model.id
                        ? "bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border-blue-500 shadow-md"
                        : "bg-slate-800/70 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`p-2 rounded-lg ${
                              selectedModelId === model.id
                                ? "bg-blue-500 text-white"
                                : "bg-slate-700 text-slate-300 group-hover:bg-blue-500/20 group-hover:text-blue-300"
                            } transition-all duration-200`}
                          >
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="font-bold text-slate-100">
                            {model?.title}
                          </div>
                        </div>
                        <div className="text-sm text-slate-400 font-mono ml-9 mb-2">
                          {model.modelName}
                        </div>
                        {model.maxTokens && (
                          <div className="flex items-center gap-2 ml-9">
                            <Zap className="w-3 h-3 text-orange-400" />
                            <span className="text-sm text-orange-400 font-semibold">
                              {model.maxTokens} tokens
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedModelId === model.id && (
                          <ChevronRight className="w-5 h-5 text-blue-400 animate-pulse" />
                        )}
                        <Button
                          onClick={(e) => handleDeleteModel(e, model.id)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* colum 2 */}
          <div className="w-1/2 p-5 bg-slate-900 ">
            {showEditPanel ? (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white shadow-md">
                    <Edit className="w-5 h-5" />
                  </div>
                  {isAdding ? "Yangi Modelni Sozlash" : `Tahrirlash`}
                </h3>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <div className="p-1 bg-purple-500/20 rounded-lg">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                    Model Nomi
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Masalan: Kreativ Yozuvchi"
                    className="h-12 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/30 rounded-xl shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <div className="p-1 bg-green-500/20 rounded-lg">
                      <Brain className="w-4 h-4 text-green-400" />
                    </div>
                    Asosiy Model
                  </label>
                  <Select
                    value={formData.modelId}
                    onValueChange={handleBaseModelChange}
                  >
                    <SelectTrigger className="h-12 bg-slate-800 border-2 border-slate-700 text-white focus:border-green-500 focus:ring-green-500/30 rounded-xl shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Asosiy modelni tanlang" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-700 bg-slate-800 text-white shadow-lg">
                      {availableBaseModels.map((model) => (
                        <SelectItem
                          key={model.id}
                          value={model.id}
                          className="rounded-lg focus:bg-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <Bot className="w-4 h-4 text-blue-400" />
                            {model?.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isAdding && (
                    <p className="text-xs text-slate-500">
                      Asosiy modelni tahrirlash rejimida o'zgartirib bo'lmaydi.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <div className="p-1 bg-yellow-500/20 rounded-lg">
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    Maksimal Tokenlar
                  </label>
                  <Input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) =>
                      handleFormChange("maxTokens", e.target.value)
                    }
                    placeholder="Masalan: 4096"
                    className="h-12 bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-yellow-500/30 rounded-xl shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <div className="p-1 bg-blue-500/20 rounded-lg">
                      <Settings className="w-4 h-4 text-blue-400" />
                    </div>
                    Model Ko'rsatmalari (System Prompt)
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      handleFormChange("content", e.target.value)
                    }
                    placeholder="Bu yerga model uchun batafsil ko'rsatmalar yozing..."
                    className="w-full min-h-[150px] p-4 bg-slate-800 text-slate-100 border-2 border-slate-700 rounded-xl resize-y focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-sm transition-all duration-200 placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-14 border-2 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700 rounded-xl font-semibold transition-all duration-200 text-lg"
                  >
                    <X className="w-5 h-5 mr-3" />
                    Bekor qilish
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || (!isAdding && !isFormDirty)}
                    className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 mr-3" />
                    )}
                    {isAdding ? "Modelni Qo'shish" : "Saqlash"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div className="animate-in fade-in-50 duration-500">
                  <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl mb-6 mx-auto w-fit">
                    <Settings className="w-20 h-20 text-slate-500 mx-auto" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-300 mb-3">
                    Sozlamalarni Boshqarish
                  </h4>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Modelni tahrirlash uchun chapdan tanlang <br /> yoki yangi
                    model qo'shing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
