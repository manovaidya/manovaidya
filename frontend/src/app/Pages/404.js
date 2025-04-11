import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
    <div className="error-page">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link href="/" passHref>
        <button className="home-button">Go Back Home</button>
      </Link>
      <style jsx>{`
        .error-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          background: #f3f4f6;
        }
        h1 {
          font-size: 3rem;
          color: #2d3748;
        }
        .error-page p {
          font-size: 1.25rem;
          color: #4a5568;
          margin-bottom: 2rem;
        }
        .home-button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          color: white;
          background: linear-gradient(to right, #f92c8b, #b02cd6);
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .home-button:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
    </>
  )
}

export default page