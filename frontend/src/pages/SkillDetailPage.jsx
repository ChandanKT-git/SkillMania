
import React from 'react';
import { useParams } from 'react-router-dom';

const SkillDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Skill Detail Page</h1>
      <p>Details for Skill ID: {id}</p>
      {/* Add content for skill details here */}
    </div>
  );
};

export default SkillDetailPage;