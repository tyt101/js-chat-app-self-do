import { Bell, GitBranch } from 'lucide-react';

/**
 * 聊天页面头部导航栏组件
 *
 * 显示内容:
 * - 左侧: 应用图标和标题
 * - 右侧: 通知和分支图标
 *
 * 特性:
 * - 简洁的顶部导航
 * - 透明背景
 */
export function ChatHeader() {
  return (
    <header className='h-16 flex items-center justify-between px-8 z-50 w-full mb-0 bg-transparent border-b-0 shadow-none sticky top-0'>
      {/* 左侧：应用标识 */}
      <div className='flex items-center gap-3'></div>

      {/* 右侧：功能图标 */}
      <div className='flex gap-5 text-gray-600 text-sm'>
        <button
          className='hover:text-gray-900 transition p-2 rounded-lg hover:bg-gray-100'
          title='通知'
        >
          <Bell className='w-4 h-4' />
        </button>
        <button
          className='hover:text-gray-900 transition p-2 rounded-lg hover:bg-gray-100'
          title='分支'
        >
          <GitBranch className='w-4 h-4' />
        </button>
      </div>
    </header>
  );
}
