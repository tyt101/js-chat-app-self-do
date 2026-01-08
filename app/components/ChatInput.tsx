import { ChatInputHandle, ChatInputProps } from "../types/send";
import { forwardRef, useRef, useState } from "react";
import { ArrowUp, Loader2, Plus, X } from "lucide-react";
import { ModelSelector } from "./ModelSelector";
export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  ({
    onSend,
    disabled,
    availableTools,
    availableModels,
    currentModel,
    onModelChange,
  }, ref) => {

    const [input, setInput] = useState('')
    const [selectedTools, setSelectedTools] = useState<string[]>([])
    const [uploadedImages, setUploadedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setUploadedImages(prev => [...prev, ...imageFiles]);
        const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
      }

      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }

    const handleSend = () => {
      if ((input.trim() || uploadedImages.length > 0) && !disabled) {
        onSend(
          input,
          selectedTools.length ? selectedTools : undefined,
          currentModel,
          uploadedImages.length ? uploadedImages : undefined,
        )
        setInput('');
        clearImages()
      }
    }

    const handleAddClick = () => {
      imageInputRef.current?.click();
    }

    // 移除图片
    const removeImage = (index: number) => {
      // 释放预览 URL
      URL.revokeObjectURL(imagePreviews[index])

      setUploadedImages(prev => prev.filter((_, i) => i !== index))
      setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // 清空所有图片
    const clearImages = () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      setUploadedImages([])
      setImagePreviews([])
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }

    return (
      <div
        className={`w-full max-w-5xl glass-panel rounded-2xl shadow-2xl shadow-gray-400/20 transition-all duration-300 ${
          disabled
            ? 'ring-1 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)]'
            : 'focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:shadow-[0_0_40px_rgba(59,130,246,0.2)]'
        }`}
      >
        {/* 输入框区域 */}
        <div className="px-4 pt-4 pb-2">
          {/* 图片预览 - 在输入框上方 */}
          {imagePreviews.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-300"
                  >
                    <img
                      src={preview}
                      alt={`上传图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* 删除按钮 */}
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-gray-800/80 hover:bg-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="移除图片"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {/* 文件名提示 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 px-1 py-0.5 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploadedImages[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 文本输入框 */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'AI 正在回复中...' : '输入您的问题，开启 AI 之旅...'}
            className={`w-full bg-transparent border-none outline-none text-gray-900 text-base resize-none max-h-32 transition-opacity ${
              disabled ? 'placeholder-yellow-600/60 opacity-60' : 'placeholder-gray-500'
            }`}
            rows={1}
            disabled={disabled}
          />
        </div>
        {/* 隐藏的文件输入框--用于上传图片 */}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageSelect} 
          ref={imageInputRef}
        />
        {/* 工具栏 */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-gray-200">
          {/* 左侧：附件，工具选择器和已选工具徽章 */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* 上传按钮 */}
            <button
              onClick={handleAddClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition flex-shrink-0 relative group"
              disabled={disabled}
              title="上传图片"
            >
              <Plus className="w-5 h-5" />
              {uploadedImages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
                  {uploadedImages.length}
                </span>
              )}
            </button>
            {/* 工具选择器 */}

            {/* 已选工具徽章 */}
          </div>
          {/* 右侧：模型选择和发送按钮 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 模型选择器 */}
            {availableModels.length > 0 && onModelChange && (
              <ModelSelector
                models={availableModels}
                selectedModel={currentModel}
                onModelChange={onModelChange}
              />
            )}
            {/* 发送按钮 */}
            <button
              onClick={handleSend}
              disabled={(!input.trim() && uploadedImages.length === 0) || disabled}
              className={`p-2 rounded-lg shadow-lg transition-all min-w-10 min-h-10 flex items-center justify-center ${
                disabled
                  ? 'bg-yellow-600/20 text-yellow-400 cursor-wait'
                  : (input.trim() || uploadedImages.length > 0)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white shadow-blue-600/20 active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {disabled ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
)