"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useGetAISettings } from '@/api/hooks/ai.hooks'
import { GlassCard } from '@/components/anyverse/GlassCard'
import { AIBotAvatar, AIBotWithText } from '@/components/ai/AIBotAvatar'
import { 
    containerVariants, 
    itemVariants, 
    staggerContainerVariants,
    cardHoverVariants,
    fadeInVariants 
} from '@/components/ai/ai-animations'
import { cn } from '@/components/ui/core/styling'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/lib/navigation'
import { 
    LuBotMessageSquare, 
    LuSparkles, 
    LuSearch, 
    LuLanguages, 
    LuUsers, 
    LuRefreshCw,
    LuBrain,
    LuArrowRight,
    LuWand,
    LuImage,
    LuBookOpen,
    LuZap,
    LuShield,
    LuGlobe,
    LuCpu,
    LuMessageCircle,
    LuScanLine,
    LuDatabase
} from 'react-icons/lu'

interface AIServiceCard {
    id: string
    title: string
    description: string
    longDescription: string
    icon: React.ElementType
    color: string
    features: string[]
    enabled: boolean
    stats?: {
        label: string
        value: string
    }
}

export default function AIServicesPage() {
    const { data: settings } = useGetAISettings()
    const router = useRouter()

    const services: AIServiceCard[] = [
        {
            id: 'concierge',
            title: 'AI Concierge',
            description: 'مساعدك الشخصي الذكي',
            longDescription: 'دردش مع مساعد AI يفهم الأنمي والمانجا. احصل على توصيات مخصصة، شرح للحبكة، تحليل الشخصيات، وإجابات لجميع أسئلتك.',
            icon: LuMessageCircle,
            color: 'from-violet-500 via-purple-500 to-fuchsia-500',
            features: [
                'محادثات طبيعية باللغة العربية',
                'توصيات شخصية مخصصة',
                'شرح الحبكة والشخصيات',
                'ردود ذكية حسب السياق',
                'دعم متعدد اللغات'
            ],
            enabled: settings?.enableChat ?? false,
            stats: { label: 'المحادثات', value: '24/7' }
        },
        {
            id: 'recap',
            title: 'الملخص الذكي',
            description: 'لا تنس أين توقفت',
            longDescription: 'احصل على ملخصات ذكية لما شاهدته أو قرأته. يحلل AI Recap تقدمك ويولد ملخصات تفصيلية لمساعدتك في العودة لأي سلسلة.',
            icon: LuScanLine,
            color: 'from-blue-500 via-cyan-500 to-teal-500',
            features: [
                'تتبع ذكي للتقدم',
                'ملخصات تفصيلية للحلقات/الفصول',
                'تسليط الضوء على النقاط الرئيسية',
                'ملاحظات تطور الشخصيات',
                'خيارات خالية من الحرق'
            ],
            enabled: settings?.enableRecap ?? false,
            stats: { label: 'الدقة', value: '95%' }
        },
        {
            id: 'lore',
            title: 'شجرة المعرفة',
            description: 'ابنِ قاعدة معرفتك',
            longDescription: 'تتبع ونظم الشخصيات والمواقع والمنظمات والمعرفة عبر جميع سلاسلك المفضلة. أنشئ موسوعة شخصية تنمو مع مجموعتك.',
            icon: LuDatabase,
            color: 'from-emerald-500 via-teal-500 to-green-500',
            features: [
                'تتبع الشخصيات',
                'قاعدة بيانات المواقع',
                'ملفات المنظمات',
                'رسم خرائط العلاقات',
                'روابط بين السلاسل'
            ],
            enabled: settings?.enableSearch ?? false,
            stats: { label: 'الإدخالات', value: '∞' }
        },
        {
            id: 'ocr',
            title: 'ترجمة الصور',
            description: 'ترجم أي صورة فوراً',
            longDescription: 'استخرج وترجم النص من أي صورة. مثالي لصفحات المانجا، لقطات الأنمي، أو أي نص ياباني تصادفه. يدعم لغات متعددة.',
            icon: LuScanLine,
            color: 'from-amber-500 via-orange-500 to-red-500',
            features: [
                'استخراج فوري للنص',
                'ترجمة متعددة اللغات',
                'تحسين لصفحات المانجا',
                'التعرف على الخط اليدوي',
                'معالجة دفعات'
            ],
            enabled: settings?.enableOcr ?? false,
            stats: { label: 'اللغات', value: '50+' }
        },
        {
            id: 'search',
            title: 'البحث بالمشاعر',
            description: 'ابحث بالمزاج والوصف',
            longDescription: 'صف ما تريد مشاهدته بلغة طبيعية. يفهم AI المشاعر والمزاج والمواضيع والأوصاف المعقدة ليجد الأنمي المثالي لك.',
            icon: LuSearch,
            color: 'from-pink-500 via-rose-500 to-red-500',
            features: [
                'بحث باللغة الطبيعية',
                'مطابقة حسب المزاج',
                'اكتشاف المواضيع',
                'إيجاد عناوين مشابهة',
                'تحليل الترند'
            ],
            enabled: settings?.enableSearch ?? false,
            stats: { label: 'قاعدة البيانات', value: '10K+' }
        },
    ]

    const activeServicesCount = services.filter(s => s.enabled).length

    return (
        <div className="min-h-screen bg-[#000000] relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                {/* Primary Purple Orb */}
                <motion.div 
                    className="absolute w-[900px] h-[900px] rounded-full opacity-30 blur-[150px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                        left: '-10%',
                        top: '-10%',
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Secondary Purple Orb */}
                <motion.div 
                    className="absolute w-[700px] h-[700px] rounded-full opacity-25 blur-[120px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
                        right: '-5%',
                        bottom: '10%',
                    }}
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Accent Pink Orb */}
                <motion.div 
                    className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                        left: '50%',
                        top: '50%',
                    }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Grid Pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 overflow-hidden">
                <div className="relative container mx-auto px-4 py-20 max-w-6xl">
                    <motion.div
                        className="text-center mb-16"
                        variants={fadeInVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-500/30 mb-8 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <LuSparkles className="w-4 h-4 text-violet-400" />
                            </motion.div>
                            <span className="text-sm text-violet-300 font-medium">مدعوم بـ Gemini AI</span>
                        </motion.div>

                        <motion.h1 
                            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            تجربة أنمي{' '}
                            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                بالذكاء الاصطناعي
                            </span>
                        </motion.h1>

                        <motion.p 
                            className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            عزز رحلتك في عالم الأنمي والمانجا مع ميزات AI متطورة.
                            من التوصيات الذكية إلى الترجمة الفورية.
                        </motion.p>

                        <motion.div
                            className="flex items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                intent="primary"
                                size="lg"
                                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 px-8"
                                onClick={() => router.push('/ai-tools')}
                            >
                                <LuWand className="w-5 h-5 mr-2" />
                                جرب أدوات AI
                            </Button>
                            <Button
                                intent="gray-basic"
                                size="lg"
                                onClick={() => router.push('/settings?tab=ai')}
                                className="border-white/20 hover:border-white/40"
                            >
                                إعدادات الذكاء الاصطناعي
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                        variants={staggerContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {[
                            { icon: LuZap, label: 'الخدمات النشطة', value: `${activeServicesCount}/${services.length}` },
                            { icon: LuBrain, label: 'نموذج AI', value: 'Gemini Pro' },
                            { icon: LuGlobe, label: 'اللغات', value: '50+' },
                            { icon: LuShield, label: 'الخصوصية', value: 'محلي' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-all duration-300 group"
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <stat.icon className="w-7 h-7 text-violet-400 mx-auto mb-3 group-hover:text-violet-300 transition-colors" />
                                </motion.div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-white/50">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {services.map((service, index) => {
                        const Icon = service.icon
                        
                        return (
                            <motion.div
                                key={service.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <GlassCard
                                    variant="medium"
                                    glow={service.enabled}
                                    glowColor="purple"
                                    className={cn(
                                        "h-full p-6 transition-all duration-500",
                                        !service.enabled && "opacity-60 grayscale"
                                    )}
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <motion.div 
                                            className={cn(
                                                "w-14 h-14 rounded-2xl bg-gradient-to-r flex items-center justify-center flex-shrink-0 shadow-lg",
                                                service.color
                                            )}
                                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Icon className="w-7 h-7 text-white" />
                                        </motion.div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-bold text-white">
                                                    {service.title}
                                                </h3>
                                                {service.enabled ? (
                                                    <motion.span 
                                                        className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium border border-violet-500/30"
                                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        نشط
                                                    </motion.span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs font-medium border border-white/10">
                                                        معطل
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/50 text-sm">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                                        {service.longDescription}
                                    </p>

                                    {/* Features List */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {service.features.map((feature, i) => (
                                            <motion.div 
                                                key={i}
                                                className="flex items-center gap-2 text-xs text-white/50"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <motion.div 
                                                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                                {feature}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        {service.stats && (
                                            <div className="text-sm">
                                                <span className="text-white/40">{service.stats.label}: </span>
                                                <span className="text-violet-400 font-semibold">{service.stats.value}</span>
                                            </div>
                                        )}
                                        <Button
                                            intent={service.enabled ? "primary" : "gray-basic"}
                                            size="sm"
                                            className={cn(
                                                service.enabled && "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-lg shadow-violet-500/25"
                                            )}
                                            onClick={() => router.push('/ai-tools')}
                                            disabled={!service.enabled}
                                        >
                                            {service.enabled ? (
                                                <>
                                                    تشغيل
                                                    <motion.span
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        <LuArrowRight className="w-4 h-4 mr-2" />
                                                    </motion.span>
                                                </>
                                            ) : (
                                                'تفعيل في الإعدادات'
                                            )}
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard
                        variant="holographic"
                        glow
                        className="p-8 md:p-12 text-center relative overflow-hidden"
                    >
                        {/* Animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 animate-pulse" />
                        
                        <div className="relative z-10">
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <AIBotAvatar size="xl" animate glow className="mx-auto mb-6" />
                            </motion.div>
                            
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                جاهز لتعزيز تجربتك؟
                            </h2>
                            
                            <p className="text-white/60 max-w-2xl mx-auto mb-8">
                                ابدأ باستخدام ميزات AI اليوم. قم بإعداد مفتاح API وافتح الإمكانات الكاملة 
                                للاكتشاف الذكي للأنمي والمانجا.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    intent="primary"
                                    size="lg"
                                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 w-full sm:w-auto shadow-lg shadow-violet-500/25"
                                    onClick={() => router.push('/settings?tab=ai')}
                                >
                                    <LuBrain className="w-5 h-5 mr-2" />
                                    ابدأ الآن
                                </Button>
                                <Button
                                    intent="gray-basic"
                                    size="lg"
                                    className="w-full sm:w-auto border-white/20 hover:border-white/40"
                                    onClick={() => router.push('/ai-tools')}
                                >
                                    <LuBookOpen className="w-5 h-5 mr-2" />
                                    عرض الأدوات
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </section>

            {/* Footer Info */}
            <footer className="container mx-auto px-4 py-8 max-w-6xl border-t border-white/10 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                    <p>تتطلب ميزات AI مفتاح Gemini API. يتم معالجة بياناتك محلياً.</p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <LuShield className="w-4 h-4 text-violet-400" />
                            الخصوصية أولاً
                        </span>
                        <span className="flex items-center gap-1">
                            <LuZap className="w-4 h-4 text-violet-400" />
                            مدعوم بـ Google Gemini
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
