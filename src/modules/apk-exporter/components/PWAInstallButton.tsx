import React, { useState } from 'react';
import { Smartphone, CheckCircle2, X, Download, Share, PlusSquare, WifiOff } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall.js';

interface PWAInstallButtonProps {
  onOpenExporter?: () => void;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenExporter,
  compact = false
}) => {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await promptInstall();
      if (outcome === 'unavailable') {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {!isOnline && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <WifiOff className="w-3.5 h-3.5" />
            <span>离线阅读模式已启用</span>
          </span>
        )}

        {isInstalled ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>已安装至手机桌面</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleInstallClick}
            className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all cursor-pointer border ${
              compact
                ? 'px-3 py-1.5 text-xs bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border-emerald-500/30'
                : 'px-3.5 py-2 text-xs bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>WebAPK 桌面直装</span>
          </button>
        )}
      </div>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">手机端安装与离线 APK 指南</h3>
                  <p className="text-xs text-slate-400">支持 Android WebAPK、单文件离线版与原生工程导出</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-emerald-400">iOS Safari 添加到主屏幕步骤：</div>
                <div className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>1. 点击浏览器底部工具栏的「分享」按钮</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2. 向下滑动并选择「添加到主屏幕 (Add to Home Screen)」</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="font-bold text-emerald-400">Android 手机安装方式：</div>
                <p className="leading-relaxed">
                  • <strong>方式 A（浏览器 WebAPK 直装）</strong>：在手机 Chrome / Edge 浏览器右上角菜单点击「安装应用 (Install App)」或「添加到主屏幕」，系统会自动编译生成无地址栏的桌面级 WebAPK。
                </p>
                <p className="leading-relaxed">
                  • <strong>方式 B（导出独立 APK 工程包 / 单文件离线版）</strong>：前往「安卓 APK 与手机阅读器工坊」，一键下载打包好的安卓 Kotlin WebView 源码工程（含 GitHub Actions 自动编译 `.apk` 流水线）或单文件手机离线阅读器。
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                知道了
              </button>
              {onOpenExporter && (
                <button
                  type="button"
                  onClick={() => {
                    setShowGuideModal(false);
                    onOpenExporter();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>前往安卓 APK 导出工坊</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
