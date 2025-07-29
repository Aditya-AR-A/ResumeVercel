import React from 'react';


const projects = [
  {
    title: 'Predictive Maintenance for Industrial Machinery',
    description: 'Developed a machine learning model to predict equipment failure, reducing downtime by 20%.',
    technologies: ['Python', 'scikit-learn', 'TensorFlow', 'Pandas']
  },
  {
    title: 'Customer Churn Prediction',
    description: 'Built a classification model to identify customers at risk of churning, improving customer retention by 15%.',
    technologies: ['Python', 'PyTorch', 'SQL', 'Tableau']
  },
  {
    title: 'Portfolio Website',
    description: 'An interactive portfolio website built with Next.js to showcase my skills and projects.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Vercel']
  }
];

const Projects = () => {
  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <div>
        {projects.map((project, index) => (
          <div key={index} className="projectCard">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="technologies">
              {project.technologies.map((tech, i) => (
                <span key={i} className="techTag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
