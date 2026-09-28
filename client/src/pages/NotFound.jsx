import { Link } from 'react-router-dom';
import { Monogram } from '../components/Logo.jsx';
import Ornament from '../components/Ornament.jsx';

export default function NotFound() {
  return (
    <section className="bg-paper grid min-h-[60vh] place-items-center py-24">
      <div className="container-x text-center">
        <Monogram className="mx-auto h-16 w-16" />
        <h1 className="mt-6 text-5xl font-semibold">Page not found</h1>
        <Ornament className="mt-6 justify-center" />
        <p className="mx-auto mt-6 max-w-md text-muted">The page you are looking for has moved or no longer exists.</p>
        <Link to="/" className="btn-primary mt-9">
          Back to home
        </Link>
      </div>
    </section>
  );
}
