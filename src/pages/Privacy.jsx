import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 bg-white p-4 rounded shadow-sm">
          <h2 className="text-center mb-4" style={{ color: '#333' }}>
            <i className="bi bi-shield-check" style={{ color: '#90be54' }}></i>{' '}
            Privacy & Policy
          </h2>

          <h4 className="mt-4" style={{ color: '#444' }}>
            <i className="bi bi-eye-fill" style={{ color: '#90be54' }}></i> Data Collection
          </h4>
          <p className="text-muted">
            We collect personal and application-related data only when users submit a form,
            register, or log in.
          </p>

          <h4 className="mt-4" style={{ color: '#444' }}>
            <i className="bi bi-lock-fill" style={{ color: '#90be54' }}></i> Data Protection
          </h4>
          <ul className="text-muted">
            <li>All passwords are encrypted using secure hashing</li>
            <li>Files are stored in restricted access folders</li>
            <li>Data is not shared with any third party without consent</li>
          </ul>

          <h4 className="mt-4" style={{ color: '#444' }}>
            <i className="bi bi-cpu-fill" style={{ color: '#90be54' }}></i> AI & Analytics
          </h4>
          <p className="text-muted">
            AI verification is used for fraud detection only. No profiling or auto-decisioning
            is performed without human admin review.
          </p>

          <h4 className="mt-4" style={{ color: '#444' }}>
            <i className="bi bi-trash-fill" style={{ color: '#90be54' }}></i> Data Removal & Rights
          </h4>
          <p className="text-muted">
            Users can request account deletion or data export anytime via our support email.
          </p>

          <h4 className="mt-4" style={{ color: '#444' }}>
            <i className="bi bi-info-circle-fill" style={{ color: '#90be54' }}></i> Contact
          </h4>
          <p className="text-muted">
            For privacy concerns, reach out to <strong>support@aidlink.com</strong>.
          </p>

          <div className="mt-5">
            <Link
              to="/"
              className="primary_btn"
            >
              Back to Home <i className="bi bi-house-door-fill" style={{ color: 'white' }}></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
