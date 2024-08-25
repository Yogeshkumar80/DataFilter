
import './Navbar.css';
const Navbar = () => {
  return (
    <nav className="sidebar">
      <div className="title">
        <span>Data</span>Filter
      </div>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">PARTNER WITH US</a></li>
        <li><a href="#">JOIN US</a></li>
        <li><a href="#">REACH US</a></li>
        <li><a href="#">OUR IDEOLOGY</a></li>
        <li><a href="#">SERVICES</a></li>
        <li><a href="#">GALLERY</a></li>
      </ul>
      <footer>Copyright © 2024  DataFilter. All Rights Reserved.</footer>
    </nav>
  );
};

export default Navbar;