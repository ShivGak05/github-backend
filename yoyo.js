import { useEffect, useState } from "react";
import { 
  GitBranch, 
  User, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Bug, 
  Plus,
  AlertCircle,
  Code2
} from "lucide-react";

const RepositoryView = () => {
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockRepository = {
      _id: "mock-id",
      name: "awesome-project",
      description: "A comprehensive web application built with React and Node.js. This project demonstrates modern web development practices and includes features like user authentication, real-time updates, and responsive design.",
      content: [
        "// main.js\nconst express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});",
        "// utils.js\nconst formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n};\n\nmodule.exports = { formatDate };"
      ],
      owner: {
        _id: "owner-id",
        username: "john_doe"
      },
      isPublic: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:45:00Z"
    };

    // Simulate API call
    setTimeout(() => {
      setRepository(mockRepository);
      setLoading(false);
    }, 1000);
  }, []);

  // Mock localStorage for demonstration
  const mockUserId = "owner-id";

  const checkOwnership = () => {
    // Replace with: localStorage.getItem("userId") !== repository.owner._id
    return mockUserId !== repository.owner._id;
  };

  const handleUpdate = () => {
    if (checkOwnership()) {
      alert("You don't have access to update this repository!");
      return;
    }
    // Replace with: navigate(`/repository/update/${repository._id}`);
    console.log("Navigate to update:", repository._id);
  };

  const handleDelete = () => {
    if (checkOwnership()) {
      alert("You don't have access to delete this repository!");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this repository?");
    if (!confirmDelete) return;
    // Replace with: navigate(`/repository/delete/${repository._id}`);
    console.log("Navigate to delete:", repository._id);
  };

  const handleToggle = () => {
    if (checkOwnership()) {
      alert("You don't have access to toggle visibility of this repository!");
      return;
    }
    // Replace with: navigate(`/repository/toggle/${repository._id}`);
    console.log("Navigate to toggle:", repository._id);
  };

  const handleViewIssues = () => {
    // Replace with: navigate(`/issue/repo/${repository._id}`);
    console.log("Navigate to view issues:", repository._id);
  };

  const handleCreateIssue = () => {
    // Replace with: navigate(`/issue/create/${repository._id}`);
    console.log("Navigate to create issue:", repository._id);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} color="#e74c3c" />
        <h2 style={styles.errorTitle}>Error</h2>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!repository) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <div style={styles.titleRow}>
              <GitBranch size={24} color="#4a90e2" />
              <h1 style={styles.title}>{repository.name}</h1>
              <span style={styles.visibilityBadge}>
                {repository.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                {repository.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <div style={styles.ownerSection}>
              <User size={16} />
              <span style={styles.ownerText}>@{repository.owner.username}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={styles.descriptionSection}>
          <p style={styles.description}>{repository.description}</p>
        </div>

        {/* Content Section */}
        <div style={styles.contentSection}>
          <div style={styles.contentHeader}>
            <Code2 size={20} />
            <h3 style={styles.contentTitle}>Repository Content</h3>
          </div>
          
          {Array.isArray(repository.content) && repository.content.length > 0 ? (
            <div style={styles.filesContainer}>
              {repository.content.map((file, index) => (
                <div key={index} style={styles.fileCard}>
                  <div style={styles.fileHeader}>
                    <FileText size={16} />
                    <span style={styles.fileName}>File {index + 1}</span>
                  </div>
                  <pre style={styles.fileContent}>{file}</pre>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noContent}>
              <FileText size={48} color="#95a5a6" />
              <p style={styles.noContentText}>No content available</p>
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div style={styles.actionsSection}>
          <div style={styles.actionGrid}>
            <button 
              style={{...styles.button, ...styles.dangerButton}} 
              onClick={handleDelete}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
            >
              <Trash2 size={16} />
              Delete
            </button>
            
            <button 
              style={{...styles.button, ...styles.primaryButton}} 
              onClick={handleUpdate}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3182ce'}
            >
              <Edit3 size={16} />
              Update
            </button>
            
            <button 
              style={{...styles.button, ...styles.warningButton}} 
              onClick={handleToggle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b7791f'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#d69e2e'}
            >
              {repository.isPublic ? <EyeOff size={16} /> : <Eye size={16} />}
              Toggle Visibility
            </button>
            
            <button 
              style={{...styles.button, ...styles.successButton}} 
              onClick={handleViewIssues}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2f855a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#38a169'}
            >
              <Bug size={16} />
              View Issues
            </button>
            
            <button 
              style={{...styles.button, ...styles.secondaryButton}} 
              onClick={handleCreateIssue}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4a5568'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#718096'}
            >
              <Plus size={16} />
              Create Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: '1px solid #e1e8ed'
  },
  
  header: {
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e1e8ed',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0,
    flex: 1
  },
  
  visibilityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#4a5568'
  },
  
  ownerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  ownerText: {
    fontSize: '14px',
    color: '#4a5568',
    fontWeight: '500'
  },
  
  descriptionSection: {
    padding: '20px 24px'
  },
  
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4a5568',
    margin: 0
  },
  
  contentSection: {
    padding: '0 24px 24px'
  },
  
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  
  contentTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d3748',
    margin: 0
  },
  
  filesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  fileCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f7fafc'
  },
  
  fileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#edf2f7',
    borderBottom: '1px solid #e2e8f0'
  },
  
  fileName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748'
  },
  
  fileContent: {
    padding: '16px',
    margin: 0,
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    fontSize: '14px',
    lineHeight: '1.5',
    overflow: 'auto',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
  },
  
  noContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center'
  },
  
  noContentText: {
    fontSize: '16px',
    color: '#718096',
    marginTop: '12px'
  },
  
  actionsSection: {
    padding: '20px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f7fafc'
  },
  
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '40px'
  },
  
  dangerButton: {
    backgroundColor: '#e53e3e',
    color: 'white'
  },
  
  primaryButton: {
    backgroundColor: '#3182ce',
    color: 'white'
  },
  
  warningButton: {
    backgroundColor: '#d69e2e',
    color: 'white'
  },
  
  successButton: {
    backgroundColor: '#38a169',
    color: 'white'
  },
  
  secondaryButton: {
    backgroundColor: '#718096',
    color: 'white'
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '40px'
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3182ce',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#718096'
  },
  
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '40px',
    textAlign: 'center'
  },
  
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#e53e3e',
    marginTop: '16px'
  },
  
  errorText: {
    fontSize: '16px',
    color: '#718096',
    marginTop: '8px'
  }
};

// Add responsive styles
const addResponsiveStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .repository-title {
        font-size: 24px !important;
      }
      
      .action-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
        gap: 8px !important;
      }
      
      .button {
        padding: 8px 12px !important;
        font-size: 13px !important;
      }
      
      .container {
        padding: 12px !important;
      }
    }
    
    @media (max-width: 480px) {
      .action-grid {
        grid-template-columns: 1fr !important;
      }
      
      .title-row {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      
      .title {
        font-size: 22px !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Add styles when component mounts
setTimeout(addResponsiveStyles, 0);

export default RepositoryView;