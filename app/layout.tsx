import React from 'react';
import '../public/styles.css';

export const metadata = {
    title: 'Review me'
}

export default function RootLayout({children} : { children : React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="navbar">
                    <div className="container">
                        <div className="logo">
                            <h1>Please, leave me a review</h1>
                        </div>
                    </div>
                </div>
                <div className="content">
                    {children}
                    <div className="separator"></div> 
                </div> 
            </body>
        </html>
    );
}