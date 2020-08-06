import React from 'react';
import { Table } from 'reactstrap';

const CustomerSupportLink = ({ text }) => (
  <a href='mailto:support@alces-flight.com'>
    {text || 'support@alces-flight.com'}
  </a>
);

const cookies = [
  {
    name: 'accepts-cookies',
    purpose: 'Application',
    description: "Records whether you've accepted our use of cookies.",
    expiration: '1 year',
  },
  {
    name: '_ga',
    purpose: 'Google Analytics',
    description: 'Used to distinguish users.',
    expiration: '2 years from latest visit',
  },
  {
    name: '_gat',
    purpose: 'Google Analytics',
    description: 'Used to throttle request rate.',
    expiration: '10 minutes',
  },
];

const CookieRow = ({ description, expiration, name, purpose }) => (
  <tr key={name}>
    <td>
      <code>{name}</code>
    </td>
    <td>{purpose}</td>
    <td>{description}</td>
    <td>{expiration}</td>
  </tr>
);

// eslint-disable-next-line react/prefer-stateless-function
class CookieTable extends React.Component {
  static defaultProps = {
    cookies: cookies,
  };

  render() {
    const { cookies } = this.props;
    const cookiesElements = cookies.map(cookie => (
      <CookieRow
        description={cookie.description}
        expiration={cookie.expiration}
        key={cookie.name}
        name={cookie.name}
        purpose={cookie.purpose}
      />
    ));
    return (
      <Table
        condensed
        responsive
      >
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Description</th>
            <th>Expiration</th>
          </tr>
        </thead>
        <tbody>
          {cookiesElements}
        </tbody>
      </Table>
    );
  }
}

const Privacy = () => (
  <div>
    <p>
      Alces Flight is committed to ensuring that your privacy is
      protected. Should we ask you to provide certain information by
      which you can be identified when using this website, then you can
      be assured that it will only be used in accordance with this
      privacy statement.
    </p>
    <p>
      Alces Flight may change this policy from time to time by
      updating this page. You should check this page from time to time
      to ensure that you are happy with any changes.
    </p>
    <p>
      This page was last updated on 9th May 2018.
    </p>
    <h3>
      What we collect
    </h3>
    <p>
      We may collect the following information:
    </p>
    <ul>
      <li>
        name and job title
      </li>
      <li>
        contact information including email address
      </li>
      <li>
        demographic information such as postcode, preferences and interests
      </li>
      <li>
        other information relevant to customer surveys and/or offers
      </li>
    </ul>
    <h3>
      What we do with the information we gather
    </h3>
    <p>
      We require this information to understand your needs and provide you
      with a better service, and in particular for the following reasons:
    </p>
    <ul>
      <li>
        Internal record keeping.
      </li>
      <li>
        We may use the information to improve our products and services.
      </li>
      <li>
        If you have agreed to receive promotional emails, we may periodically
        send emails about new products, special offers or other information
        which we think you may find interesting using the email address which
        you have provided.
      </li>
      <li>
        If you have agreed to receive market research, we may from time to
        time also use your information to contact you for market research
        purposes. We may contact you by email, phone, fax or mail. We may use
        the information to customize the website according to your interests.
      </li>
    </ul>
    <h3>
      How long we keep the information we gather
    </h3>
    <p>
      We keep the information we gather for as long as your account is active.
      You can find instructions on how to deactivate your account under
      "Controlling your personal information" below.
    </p>
    <h3>
      Security
    </h3>
    <p>
      We are committed to ensuring that your information is secure. In order
      to prevent unauthorized access or disclosure, we have put in place
      suitable physical, electronic and managerial procedures to safeguard
      and secure the information we collect online.
    </p>
    <h4>
      How we use cookies
    </h4>
    <p>
      A cookie is a small file which is stored on your
      computer. Cookies have many uses including: helping to analyse
      web traffic, letting you know when you visit a particular site
      and allowing web applications to respond to you as an
      individual. The web application can tailor its operations to
      your needs, likes and dislikes by gathering and remembering
      information about your preferences.  You might like to visit{' '}
      <a
        href="http://www.allaboutcookies.org"
        target="_blank"
      >
        All About Cookies
      </a>{' '}
      for further information about what cookies are, how they work
      and how they are used.
    </p>
    <p>
      On this website we use traffic log cookies to identify which pages are
      being used. This helps us analyse data about how our website is being
      used and allows us to improve it in order to tailor it to customer
      needs. These cookies store no personal details and we only use this
      information for statistical analysis purposes.
    </p>
    <p>
      Overall, cookies help us provide you with a better website by enabling
      us to monitor which pages you find useful and which you do not. A
      cookie in no way gives us access to your computer or any information
      about you, other than the data you choose to share with us.
    </p>
    <p>
      You can choose to accept or decline cookies. Most web browsers
      automatically accept cookies, but you can usually modify your browser
      setting to decline cookies if you prefer.  Please note that
      configuring your browser to decline all cookies may prevent you from
      taking full advantage of websites that you visit.
    </p>
    <h4>
      Cookie usage
    </h4>
    <p>
      The table below describes the cookies that are used on this website.
    </p>
    <CookieTable />
    <h3>
      Links to other websites
    </h3>
    <p>
      Our website may contain links to other websites of interest. However,
      once you have used these links to leave our site, you should note that
      we do not have any control over that other website. Therefore, we
      cannot be responsible for the protection and privacy of any
      information which you provide whilst visiting such sites and such
      sites are not governed by this privacy statement. You should exercise
      caution and look at the privacy statement applicable to the website in
      question.
    </p>
    <h3>
      Controlling your personal information
    </h3>
    <p>
      You may choose to restrict the collection or use of your personal
      information in the following ways:
    </p>
    <ul>
      <li>
        When you are asked to fill in a form on the website, you may be
        presented with a box that you can click to indicate that you would
        like to be contacted for direct marketing purposes.  If you do not
        want anybody to contact you for direct marketing purposes, do not
        click the box.
      </li>
      <li>
        If you have previously agreed to us using your personal information
        for direct marketing purposes, you may change your mind at any time
        writing to us at the address below, emailing us at
        {' '}<CustomerSupportLink />, or phoning us at the number below.
      </li>
    </ul>
    <p>
      We will not sell, distribute or lease your personal information to
      third parties unless we have your permission or are required by law to
      do so. We may use your personal information to send you promotional
      information about third parties which we think you may find
      interesting if you tell us that you wish this to happen.
    </p>
    <p>
      You may request your personal information which we hold about you to be
      erased by writing to us at the below address or phoning us on the below
      phone number. We will promptly erase all of your applicable personal
      information.
    </p>
    <p>
      You may request details of personal information which we hold about
      you under the General Data Protection Regulation free of charge. If you
      would like a copy of the information held on you please write to:
    </p>
    <address>
      Data Protection Officer<br />
      4 Murdock Road<br />
      Bicester<br />
      Oxfordshire<br />
      OX26 4PP<br />
    </address>
    <p>
      Or phone us on 01869 249065.
    </p>
    <p>
      If you believe that any information we are holding on you is incorrect
      or incomplete, please write to or email us as soon as possible at the
      above address, or phone us on the above number. We will promptly correct
      any information found to be incorrect.
    </p>
  </div>
);

Privacy.title = 'Privacy policy.';
Privacy.overview = `
This privacy policy sets out how Alces Flight uses and protects any
information that you give Alces Flight when you use this website.
`;

export default Privacy;
