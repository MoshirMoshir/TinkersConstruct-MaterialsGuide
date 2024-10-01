import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import './Donate.css';

const Donate: React.FC = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="donate-page">
        <h1>Support Me!</h1>
        <div className="donation-cards">
          {/* PayPal Donation Card */}
          <div className="donation-card">
            <h2>Donate via PayPal</h2>
            <p>Support me directly through PayPal.</p>
            <form action="https://www.paypal.com/donate" method="post" target="_top">
              <input type="hidden" name="business" value="C9CAJFYWQXR9C" />
              <input type="hidden" name="no_recurring" value="0" />
              <input
                type="hidden"
                name="item_name"
                value="Support me and this project directly if you have the extra cash!"
              />
              <input type="hidden" name="currency_code" value="USD" />
              <input
                type="image"
                src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                name="submit"
                title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"
                className="paypal-button"
              />
              <img
                alt=""
                src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                width="1"
                height="1"
                className="paypal-pixel"
              />
            </form>
          </div>

          {/* Patreon Donation Card */}
          <div className="donation-card">
            <h2>Support on Patreon</h2>
            <p>Support me for the long-term.</p>
            <a
              href="https://patreon.com/moshirmoshir?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
              target="_blank"
              rel="noopener noreferrer"
              className="patreon-button"
            >
              <img src="/assets/patreon.png" alt="Patreon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
