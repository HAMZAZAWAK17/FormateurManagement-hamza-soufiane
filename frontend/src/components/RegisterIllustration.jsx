import React from 'react';
import { Box } from '@mui/material';

/**
 * Illustration SVG animée pour la page d'inscription
 */
const RegisterIllustration = () => {
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
                {/* Background circles */}
                <circle cx="250" cy="200" r="150" fill="#667eea" opacity="0.1" />
                <circle cx="250" cy="200" r="100" fill="#764ba2" opacity="0.1" />

                {/* Document/Form */}
                <rect x="150" y="100" width="200" height="250" fill="#ffffff" rx="8" stroke="#667eea" strokeWidth="3" />

                {/* Form lines */}
                <rect x="180" y="130" width="140" height="8" fill="#667eea" opacity="0.3" rx="4" />
                <rect x="180" y="150" width="100" height="6" fill="#764ba2" opacity="0.2" rx="3" />
                <rect x="180" y="165" width="120" height="6" fill="#764ba2" opacity="0.2" rx="3" />

                <rect x="180" y="190" width="140" height="8" fill="#667eea" opacity="0.3" rx="4" />
                <rect x="180" y="210" width="110" height="6" fill="#764ba2" opacity="0.2" rx="3" />

                <rect x="180" y="235" width="140" height="8" fill="#667eea" opacity="0.3" rx="4" />
                <rect x="180" y="255" width="90" height="6" fill="#764ba2" opacity="0.2" rx="3" />

                {/* Checkboxes */}
                <rect x="180" y="285" width="15" height="15" fill="none" stroke="#667eea" strokeWidth="2" rx="2" />
                <path d="M 184 292 L 188 296 L 193 287" stroke="#48bb78" strokeWidth="2" fill="none">
                    <animate attributeName="stroke-dasharray" values="0,20;20,0" dur="2s" repeatCount="indefinite" />
                </path>

                <rect x="180" y="310" width="15" height="15" fill="none" stroke="#667eea" strokeWidth="2" rx="2" />
                <path d="M 184 317 L 188 321 L 193 312" stroke="#48bb78" strokeWidth="2" fill="none">
                    <animate attributeName="stroke-dasharray" values="0,20;20,0" dur="2s" begin="0.5s" repeatCount="indefinite" />
                </path>

                {/* Pen/Pencil */}
                <g transform="translate(320, 180)">
                    <rect x="0" y="0" width="8" height="60" fill="#ffd6a5" rx="2">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 4 0;-15 4 0;0 4 0"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                    </rect>
                    <polygon points="0,60 8,60 4,70" fill="#764ba2" />
                </g>

                {/* Person silhouette */}
                <circle cx="250" cy="140" r="20" fill="#667eea" opacity="0.4" />
                <path d="M 250 160 Q 230 180 225 200 L 275 200 Q 270 180 250 160 Z" fill="#667eea" opacity="0.4" />

                {/* Stars/Sparkles */}
                <g opacity="0.6">
                    <path d="M 100 150 L 105 155 L 100 160 L 95 155 Z" fill="#ffd700">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M 380 120 L 385 125 L 380 130 L 375 125 Z" fill="#ffd700">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M 120 280 L 125 285 L 120 290 L 115 285 Z" fill="#ffd700">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Floating icons */}
                <circle cx="400" cy="200" r="10" fill="#48bb78" opacity="0.4">
                    <animate attributeName="cy" values="200;190;200" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <rect x="90" y="220" width="15" height="15" fill="#764ba2" opacity="0.4" rx="3">
                    <animate attributeName="y" values="220;210;220" dur="3s" repeatCount="indefinite" />
                </rect>
            </svg>
        </Box>
    );
};

export default RegisterIllustration;
