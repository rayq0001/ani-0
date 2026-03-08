"use client"

import { GlassCard } from "@/components/anyverse"
import { NeonBadge } from "@/components/anyverse/NeonBadge"
import { HolographicButton } from "@/components/anyverse/HolographicButton"
import { useAtom, useAtomValue } from "jotai"
import { 
    userSubscriptionAtom, 
    anyCoinBalanceAtom, 
    SubscriptionTier 
} from "../../_atoms/anyverse.atoms"
import { motion } from "framer-motion"
import React from "react"
import { 
    LuCrown, 
    LuZap, 
    LuSparkles, 
    LuCheck, 
    LuLock,
    LuCoins,
    LuWallet
} from "react-icons/lu"

interface SubscriptionTierInfo {
    tier: SubscriptionTier
    name: string
    price: string
    description: string
    features: string[]
    color: "purple" | "gold" | "blue"
    icon: React.ReactNode
}

const subscriptionTiers: SubscriptionTierInfo[] = [
    {
        tier: "standard",
        name: "Standard",
        price: "Free",
        description: "Basic manga reading experience",
        features: [
            "Basic manga reading",
            "OCR Translation",
            "Limited AI Chat",
            "Standard support",
        ],
        color: "purple",
        icon: <LuWallet className="w-5 h-5" />,
    },
    {
        tier: "pro",
        name: "Pro",
        price: "$9.99/mo",
        description: "Enhanced AI-powered experience",
        features: [
            "Everything in Standard",
            "AI Concierge",
            "Voice Dubbing",
            "Dynamic OST",
            "No Ads",
            "Priority support",
        ],
        color: "gold",
        icon: <LuZap className="w-5 h-5" />,
    },
    {
        tier: "elite",
        name: "Elite",
        price: "$29.99/mo",
        description: "Full Anyverse experience",
        features: [
            "Everything in Pro",
            "AI Director (3D Views)",
            "Digital Twin",
            "Character Chat",
            "Unlimited What-If?",
            "Early access",
        ],
        color: "blue",
        icon: <LuCrown className="w-5 h-5" />,
    },
]

interface SubscriptionCardProps {
    tier: SubscriptionTierInfo
    isCurrentPlan: boolean
    onSelect: (tier: SubscriptionTier) => void
}

function SubscriptionCardComponent({ tier, isCurrentPlan, onSelect }: SubscriptionCardProps) {
    return (
        <GlassCard
            variant={isCurrentPlan ? "holographic" : "medium"}
            glow={isCurrentPlan}
            glowColor={tier.color}
            hover
            className="relative p-6"
        >
            {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <NeonBadge color={tier.color} size="sm">
                        Current Plan
                    </NeonBadge>
                </div>
            )}

            <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    tier.color === "purple" ? "bg-violet-600/20" :
                    tier.color === "gold" ? "bg-amber-600/20" : "bg-blue-600/20"
                }`}>
                    <div className={tier.color === "purple" ? "text-violet-400" :
                        tier.color === "gold" ? "text-amber-400" : "text-blue-400"
                    }>
                        {tier.icon}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-2xl font-bold" style={{
                    color: tier.color === "purple" ? "#8b5cf6" :
                           tier.color === "gold" ? "#f59e0b" : "#3b82f6"
                }}>{tier.price}</p>
                <p className="text-sm text-white/50 mt-2">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-white/70">
                        <LuCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <HolographicButton
                onClick={() => onSelect(tier.tier)}
                disabled={isCurrentPlan}
                glowColor={tier.color}
                className="w-full"
            >
                {isCurrentPlan ? (
                    <>Current Plan</>
                ) : (
                    <>Upgrade Now</>
                )}
            </HolographicButton>
        </GlassCard>
    )
}

export function SubscriptionPanel() {
    const [currentTier, setCurrentTier] = useAtom(userSubscriptionAtom)
    const [anyCoins, setAnyCoins] = useAtom(anyCoinBalanceAtom)

    const handleSelectTier = (tier: SubscriptionTier) => {
        // In production, this would trigger payment flow
        setCurrentTier(tier)
    }

    return (
        <div className="space-y-8">
            {/* AnyCoin Balance */}
            <GlassCard variant="medium" className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-amber-600/20">
                            <LuCoins className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-white/50">AnyCoin Balance</p>
                            <p className="text-2xl font-bold text-white">{anyCoins}</p>
                        </div>
                    </div>
                    <HolographicButton size="sm" glowColor="gold">
                        Buy Coins
                    </HolographicButton>
                </div>
            </GlassCard>

            {/* Subscription Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionTiers.map((tier) => (
                    <SubscriptionCardComponent
                        key={tier.tier}
                        tier={tier}
                        isCurrentPlan={currentTier === tier.tier}
                        onSelect={handleSelectTier}
                    />
                ))}
            </div>

            {/* Feature Comparison */}
            <GlassCard variant="light" className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <LuSparkles className="w-5 h-5 text-violet-400" />
                    Feature Comparison
                </h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-white/70">Feature</th>
                                <th className="text-center py-3 px-4 text-white/70">Standard</th>
                                <th className="text-center py-3 px-4 text-amber-400">Pro</th>
                                <th className="text-center py-3 px-4 text-blue-400">Elite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["Basic Reading", true, true, true],
                                ["OCR Translation", true, true, true],
                                ["AI Concierge", false, true, true],
                                ["Voice Dubbing", false, true, true],
                                ["Dynamic OST", false, true, true],
                                ["AI Director (3D)", false, false, true],
                                ["Character Chat", false, false, true],
                                ["What-If? Chapters", false, false, "Unlimited"],
                            ].map(([feature, standard, pro, elite], index) => (
                                <tr key={index} className="border-b border-white/5">
                                    <td className="py-3 px-4 text-white/70">{feature as string}</td>
                                    <td className="text-center py-3 px-4">
                                        {renderFeatureValue(standard)}
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        {renderFeatureValue(pro)}
                                    </td>
                                    <td className="text-center py-3 px-4">
                                        {renderFeatureValue(elite)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    )
}

function renderFeatureValue(value: boolean | string) {
    if (value === true) {
        return <LuCheck className="w-5 h-5 text-emerald-400 mx-auto" />
    }
    if (value === false) {
        return <LuLock className="w-5 h-5 text-white/20 mx-auto" />
    }
    return <span className="text-violet-400">{value as string}</span>
}

export default SubscriptionPanel

