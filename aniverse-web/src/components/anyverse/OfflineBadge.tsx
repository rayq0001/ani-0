"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { LuDownload, LuCheck, LuWifiOff } from 'react-icons/lu';

interface OfflineBadgeProps {
    progress: number;
    status: 'downloading' | 'completed' | 'error' | 'pending';
    title?: string;
}

export const OfflineBadge = ({ progress, status, title }: OfflineBadgeProps) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return <LuCheck className="w-3.5 h-3.5 text-emerald-400" />;
            case 'error':
                return <LuWifiOff className="w-3.5 h-3.5 text-red-400" />;
            case 'downloading':
                return <LuDownload className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />;
            default:
                return <LuDownload className="w-3.5 h-3.5 text-gray-400" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'completed':
                return 'Ready for Offline';
            case 'error':
                return 'Download Error';
            case 'downloading':
                return `Downloading... ${progress}%`;
            default:
                return 'In Queue';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-emerald-500/30"
        >
            {/* Circular Progress */}
            <div className="relative w-8 h-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <path 
                        className="stroke-gray-800 stroke-[3] fill-none" 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                    {/* Progress circle */}
                    <motion.path 
                        className={`stroke-[3] fill-none ${status === 'completed' ? 'stroke-emerald-400' : 'stroke-emerald-500'}`}
                        strokeDasharray={`${progress}, 100`}
                        strokeLinecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 0.5 }}
                    />
                </svg>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {getStatusIcon()}
                </div>
            </div>

            {/* Status Text */}
            <div className="flex flex-col">
                <span className="text-[10px] text-emerald-400 uppercase tracking-tighter font-bold">
                    {getStatusText()}
                </span>
                {title && (
                    <span className="text-[9px] text-gray-500 truncate max-w-[100px]">
                        {title}
                    </span>
                )}
            </div>

            {/* Progress bar for downloading */}
            {status === 'downloading' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default OfflineBadge;
