import React from 'react';
import { Box } from '@mui/material';

/**
 * Illustration SVG animée pour la page mot de passe oublié
 */
const ForgotPasswordIllustration = () => {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '500px',
                animation: 'float 3s ease-in-out infinite'
            }}
        >
            <svg
                viewBox="0 0 500 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background */}
                <circle cx="250" cy="200" r="120" fill="#667eea" opacity="0.1" />

                {/* Large lock */}
                <rect x="200" y="180" width="100" height="120" fill="#667eea" rx="8" />
                <rect x="210" y="190" width="80" height="100" fill="#8b9cff" rx="4" />
                <circle cx="250" cy="150" r="50" fill="none" stroke="#667eea" strokeWidth="12" />
                <circle cx="250" cy="150" r="50" fill="none" stroke="#8b9cff" strokeWidth="8" />

                {/* Keyhole */}
                <circle cx="250" cy="230" r="12" fill="#667eea" />
                <rect x="245" y="230" width="10" height="30" fill="#667eea" rx="2" />

                {/* Key floating */}
                <g transform="translate(320, 140)">
                    <circle cx="0" cy="0" r="15" fill="#ffd700" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <rect x="10" y="-4" width="40" height="8" fill="#ffd700" opacity="0.8" rx="2" />
                    <rect x="45" y="-10" width="5" height="8" fill="#ffd700" opacity="0.8" />
                    <rect x="45" y="2" width="5" height="8" fill="#ffd700" opacity="0.8" />
                    <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="320,140;300,160;320,140"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 0 0;-20 0 0;0 0 0"
                        dur="3s"
                        repeatCount="indefinite"
                        additive="sum"
                    />
                </g>

                {/* Email envelope */}
                <g transform="translate(120, 280)">
                    <rect x="0" y="0" width="80" height="60" fill="#ffffff" stroke="#764ba2" strokeWidth="3" rx="4" />
                    <path d="M 0 0 L 40 30 L 80 0" stroke="#764ba2" strokeWidth="3" fill="none" />
                    <circle cx="40" cy="30" r="3" fill="#48bb78">
                        <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Question marks */}
                <text x="150" y="120" fill="#764ba2" fontSize="40" opacity="0.3" fontWeight="bold">
                    ?
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                </text>
                <text x="340" y="250" fill="#764ba2" fontSize="35" opacity="0.3" fontWeight="bold">
                    ?
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
                </text>

                {/* Sparkles */}
                <g opacity="0.6">
                    <path d="M 380 100 L 385 105 L 380 110 L 375 105 Z" fill="#ffd700">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 100 200 L 105 205 L 100 210 L 95 205 Z" fill="#ffd700">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M 400 300 L 405 305 L 400 310 L 395 305 Z" fill="#ffd700">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Reset arrow */}
                <g transform="translate(250, 320)">
                    <path d="M -20 0 Q -20 -20 0 -20 Q 20 -20 20 0" stroke="#48bb78" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <polygon points="20,0 15,-8 25,-8" fill="#48bb78" />
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 250 320;360 250 320"
                        dur="4s"
                        repeatCount="indefinite"
                    />
                </g>
            </svg>
        </Box>
    );
};

export default ForgotPasswordIllustration;
