import React from 'react'
import './_userDataDeletionInstructions.scss'

const UserDataDeletionInstructions = () => {
  return (
    <div className="deletion-page">
      <div className="deletion-page__hero">
        <span className="deletion-page__badge">Facebook Login</span>
        <h1>User Data Deletion Instructions</h1>
        <p>
          If you want your Facebook login data removed from Abhushan Gallery,
          follow the instructions below.
        </p>
      </div>

      <div className="deletion-page__content">
        <section className="deletion-card">
          <h2>How to request deletion</h2>
          <ol>
            <li>Send an email to our support email and admin email.</li>
            <li>Include your Facebook email ID in the request.</li>
            <li>We will review and process the deletion request.</li>
          </ol>
        </section>

        <section className="deletion-card deletion-card--highlight">
          <h2>Contact emails</h2>
          <div className="deletion-card__emails">
            <a href="mailto:abhushangallery2023@gmail.com">
              Support: abhushangallery2023@gmail.com
            </a>
            <a href="mailto:adminemail12@gmail.com">
              Admin: adminemail12@gmail.com
            </a>
          </div>
        </section>

        <section className="deletion-card">
          <h2>What happens next</h2>
          <p>
            Your data will be deleted within 7 business days after we receive a
            valid deletion request.
          </p>
        </section>

        <section className="deletion-card deletion-card--note">
          <h2>Important</h2>
          <p>
            Please make sure the email you use matches the Facebook account you
            want removed so we can verify the request quickly.
          </p>
        </section>
      </div>
    </div>
  )
}

export default UserDataDeletionInstructions