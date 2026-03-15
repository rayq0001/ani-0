import React, { useState, useEffect } from "react"

interface TypewriterTextProps {
    text: string
    speed?: number
    onComplete?: () => void
    className?: string
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
    text, 
    speed = 30, 
    onComplete,
    className = ""
}) => {
    const [displayedText, setDisplayedText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    // Reset when text changes
    useEffect(() => {
        setDisplayedText("")
        setCurrentIndex(0)
    }, [text])

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, speed)
            return () => clearTimeout(timeout)
        } else if (onComplete && text.length > 0) {
            onComplete()
        }
    }, [currentIndex, text, speed, onComplete])

    return (
        <span className={className}>
            {displayedText}
            {currentIndex < text.length && (
                <span className="inline-block w-[0.4em] h-[1em] bg-purple-400 ml-1 animate-pulse align-middle" />
            )}
        </span>
    )
}
