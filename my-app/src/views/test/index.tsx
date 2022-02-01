/* eslint-disable no-console */
import React, { useEffect } from 'react';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import Loading from '@/components/loading';
import { updateRedux } from '@/ducks/common';
import { $getState, $dispatch } from '@/ducks/main';
import Style from './index.less';

console.log('get redux data => ', $getState().common.redux);

const Test = ({ redux }) => {
  console.log('redux => ', redux);

  useEffect(() => {
    // console.log('Object.fromEntries', Object.fromEntries);
    Loadable.preloadAll();
    $dispatch(updateRedux('redux update'));
  }, []);

  return (
    <div className={Style.testContainer}>
      <div className={Style.content}>
        <div className={Style.calculator}>
          <div className={Style.blueball}>
            <div className={Style.blueball1}></div>
            <div className={Style.blueball2}></div>
            <Loading text='Click me' />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    redux: state.common.redux,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Test);
