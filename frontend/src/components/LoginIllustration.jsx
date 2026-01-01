import React from 'react';
import { Box } from '@mui/material';

/**
 * Illustration SVG animée pour la page de connexion
 */
const LoginIllustration = () => {
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
                {/* Desk */}
                <rect x="100" y="280" width="300" height="8" fill="#5a3880" opacity="0.8" rx="4" />
                <rect x="110" y="288" width="8" height="80" fill="#4c63d2" opacity="0.6" />
                <rect x="282" y="288" width="8" height="80" fill="#4c63d2" opacity="0.6" />

                {/* Laptop */}
                <rect x="180" y="200" width="140" height="90" fill="#667eea" rx="4">
                    <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
                </rect>
                <rect x="190" y="210" width="120" height="70" fill="#8b9cff" rx="2" />

                {/* Laptop screen content */}
                <rect x="200" y="220" width="40" height="4" fill="#667eea" rx="2" />
                <rect x="200" y="230" width="60" height="4" fill="#667eea" rx="2" opacity="0.6" />
                <rect x="200" y="240" width="50" height="4" fill="#667eea" rx="2" opacity="0.4" />
                <circle cx="285" cy="250" r="15" fill="#764ba2" opacity="0.3">
                    <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Person */}
                <circle cx="250" y="150" r="25" fill="#ffd6a5" />
                <path d="M 250 175 Q 230 200 220 240 L 280 240 Q 270 200 250 175 Z" fill="#667eea" />
                <rect x="215" y="240" width="15" height="40" fill="#4c63d2" rx="2" />
                <rect x="270" y="240" width="15" height="40" fill="#4c63d2" rx="2" />

                {/* Arm typing */}
                <rect x="230" y="200" width="40" height="8" fill="#ffd6a5" rx="4">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 230 200;-5 230 200;0 230 200"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </rect>

                {/* Coffee cup */}
                <rect x="350" y="250" width="30" height="35" fill="#764ba2" rx="4" />
                <ellipse cx="365" cy="250" rx="15" ry="5" fill="#8b9cff" />
                <path d="M 380 260 Q 395 260 395 270" stroke="#764ba2" strokeWidth="3" fill="none" />

                {/* Plant */}
                <rect x="120" y="260" width="20" height="25" fill="#764ba2" rx="2" />
                <circle cx="130" cy="250" r="15" fill="#48bb78" />
                <circle cx="125" cy="245" r="10" fill="#48bb78" />
                <circle cx="135" cy="245" r="10" fill="#48bb78" />

                {/* Floating elements */}
                <circle cx="80" cy="100" r="8" fill="#667eea" opacity="0.3">
                    <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="420" cy="150" r="6" fill="#764ba2" opacity="0.3">
                    <animate attributeName="cy" values="150;140;150" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <rect x="400" y="80" width="12" height="12" fill="#8b9cff" opacity="0.3" rx="2">
                    <animate attributeName="y" values="80;70;80" dur="2.8s" repeatCount="indefinite" />
                </rect>

                {/* Code symbols */}
                <text x="70" y="200" fill="#667eea" fontSize="20" opacity="0.4" fontFamily="monospace">
                    {'</>'}
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </text>
                <text x="410" y="250" fill="#764ba2" fontSize="16" opacity="0.4" fontFamily="monospace">
                    {'{}'}
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
                </text>
            </svg>
        </Box>
    );
};

export default LoginIllustration;
