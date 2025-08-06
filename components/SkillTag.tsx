import React from 'react';

type SkillTagProps = {
  skill: string;
  onClick?: () => void;
  className?: string;
};

const SkillTag: React.FC<SkillTagProps> = ({ skill, onClick, className }) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition ${className}`}
      onClick={onClick}
    >
      {skill}
    </span>
  );
};

export default SkillTag;
