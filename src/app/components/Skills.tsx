import React from 'react';


const Skills = () => {
  return (
    <section id="skills" className="section">
      <h2>Skills</h2>
      <div className="skillsContainer">
        <div className="skillCategory">
          <h3>Programming Languages</h3>
          <ul>
            <li>Python</li>
            <li>JavaScript</li>
            <li>SQL</li>
          </ul>
        </div>
        <div className="skillCategory">
          <h3>Data Science & Machine Learning</h3>
          <ul>
            <li>TensorFlow</li>
            <li>PyTorch</li>
            <li>scikit-learn</li>
            <li>Pandas</li>
            <li>NumPy</li>
          </ul>
        </div>
        <div className="skillCategory">
          <h3>Web Development</h3>
          <ul>
            <li>React</li>
            <li>Next.js</li>
            <li>Node.js</li>
            <li>Flask</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
