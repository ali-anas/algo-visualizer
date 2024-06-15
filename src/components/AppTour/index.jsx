import Joyride, { STATUS } from 'react-joyride';
import stepsData from './AppTourData';
import { useState } from 'react';
import classes from './AppTour.module.scss'

const AppTour = () => {
  const [tourInProgress, setTourInProgress] = useState(false);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // You need to set our tourInProgress state to false, so we can restart if we click start again.
      setTourInProgress(false);
    }
  }

  return (
    <>
      <div className="hidden">
        <Joyride
          steps={stepsData}
          continuous
          callback={handleJoyrideCallback}
          run={tourInProgress}
          showProgress
          showSkipButton
          hideCloseButton
        />
      </div>
      <button className={classes.tourBtn} onClick={() => setTourInProgress(true)}>
        Take a Tour!
      </button>
    </>
  )
}

export default AppTour;