import {GrLocation} from 'react-icons/gr'
import {BsPhone} from 'react-icons/bs'
import {AiOutlineMail} from 'react-icons/ai'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'
import {getImageUrl} from 'src/helpers/getImageUrl.helper'

export const ProfileInfo = ({profileDetails}: Comp.ProfileDetailProps) => {
  return (
    <div className="profileDetail-container">
      <div className="profileDetail">
        <div className="profileDetail-topinfo">
          <div className="profileDetail-topinfo-image">
            <OptimizedImage
              src={getImageUrl('user', profileDetails?.image)}
              alt={profileDetails.fullname || 'User profile image'}
              width={100}
              height={100}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div className="profileDetail-topinfo-right">
            <div className="profileDetail-topinfo-right-fullname">
              {profileDetails.fullname}
            </div>
            <div className="profileDetail-topinfo-right-members">
              Member since {profileDetails.memberSince}
            </div>
            <div className="profileDetail-topinfo-right-location">
              <span>
                <GrLocation />
              </span>
              {profileDetails.location}
            </div>
          </div>
        </div>

        <div className="profileDetail-contacts">
          <div className="profileDetail-contacts-phone">
            <div className="profileDetail-contacts-phone-icons">
              <BsPhone />
            </div>
            <div className="profileDetail-contacts-phone-number">
              +977-{profileDetails.phone}
            </div>
          </div>
          <div className="profileDetail-contacts-email">
            <div className="profileDetail-contacts-email-icons">
              <AiOutlineMail />
            </div>
            <div className="profileDetail-contacts-email-mailaddr">
              {profileDetails.email}
            </div>
          </div>
        </div>
        {/* <div className="profileDetail-moreLink">
          {businessCard && (
            <p onClick={() => navigate('/jobs')}>
              <span className="profileDetail-moreLink-link">
                <span>See all jobs</span>
                <BsArrowRight />
              </span>
            </p>
          )}
          {profileCard && (
            <p onClick={() => navigate('/classified-ads')}>
              <span className="profileDetail-moreLink-link">
                <span>See all ads</span>
                <BsArrowRight />
              </span>
            </p>
          )}
        </div> */}

        {/* <div className="profileDetail-footer">
          <div className="profileDetail-footer-links">
            <AiOutlineHeart />
          </div>
          <div className="profileDetail-footer-links">
            <AiOutlineRetweet />
          </div>
          <div className="profileDetail-footer-links">
            <BsPrinter />
          </div>
        </div> */}
      </div>
    </div>
  )
}
