import React from 'react';

export default function PageHeader({ title = "My Hero Space", description = "Track your impact and grow your hero journey." }) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}