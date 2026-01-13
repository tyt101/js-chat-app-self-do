'use client'
import { Check, ChevronDown } from "lucide-react";
import { ModelSelectorProps } from "../types/model";
import { useState, useRef, useEffect } from "react";
export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentModel = models.find(model => model.id === selectedModel);


  const handleModelChange = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  }



  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      // 排除自身元素
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}
    
    >
      <button
        type="button"
        className="
          flex items-center gap-1.5 px-3 py-2
          text-slate-300 text-sm
          hover:bg-white/5 rounded-lg
          transition-all duration-200
        "
        onClick={() => setIsOpen(!isOpen)}
        title="选择模型"
      >
        <span className="font-medium">{currentModel?.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 下拉菜单 */}
      {
        isOpen && (
          <div
            className="
              absolute bottom-full left-0 mb-2 w-64
              bg-slate-900/95 backdrop-blur-xl
              border border-white/10
              rounded-xl shadow-2xl
              overflow-hidden
              animate-in slide-in-from-bottom-2 duration-200
            "
          >
            {/* 标题 */}
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                选择模型
              </h3>
            </div>

            {/* 模型列表 */}
            <div className="max-h-80 overflow-y-auto">
              {
                models.map(model => {
                  const isSelected = model.id === selectedModel;
                  return <button 
                    key={model.id} 
                    type="button"
                    onClick={() => handleModelChange(model.id)}
                    className={`
                      w-full px-4 py-2.5
                      text-left text-sm
                      hover:bg-white/5 transition-colors duration-200
                      ${isSelected ? 'bg-white/5 text-white' : 'text-slate-300'}
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-medium">{model.name}</span>
                        {
                          model.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {model.description}
                            </p>
                          )
                        }
                      </div>
                      {isSelected && <Check className="w-4 h-4 ml-auto text-green-500" />}
                    </div>
                  </button>
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
}