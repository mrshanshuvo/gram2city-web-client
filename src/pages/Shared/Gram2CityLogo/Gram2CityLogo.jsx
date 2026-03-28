import logo from '../../../assets/logo/landscape-logo.png';
import { Link } from 'react-router';

const Gram2CityLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-center gap-2" aria-label="Gram2City logo">
        <img
          src={logo}
          alt="Gram2City logo"
          className="object-contain h-12"
        />

        {/* Brand Text */}
        <span className="text-2xl font-extrabold tracking-tight">
          <span className="text-[#2E7D32]">Gram</span>
          <span className="text-[#F4C20D]">2</span>
          <span className="text-[#1E5AA8]">City</span>
        </span>
      </div>
    </Link>
  );
};

export default Gram2CityLogo;