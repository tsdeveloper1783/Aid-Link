import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const ErrorPage = () => {
  return (
    <div className="page-wrapper">
    <Header/>
    <section className="error-section">
      <div className="theme_container">
        <div className="row text-center">
          <div className="error-block">
             <div className="image">
              <img src="/assets/images/404.png" alt="404 Error" />
            </div>
            <h3>OPPS!</h3>
            <div className="text">
              We’re Sorry the page can’t be found / Under Construction
            </div>
            <div className="error-button mb-5">
              <Link to="/" className="primary_btn">
                Go to Home <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  );
};

export default ErrorPage;
