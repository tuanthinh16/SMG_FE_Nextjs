import React from 'react';
import styles from '../style/loading.module.css';
const Loading = () => {
    return (
        <div className='m-auto p-auto font-bold text-3xl text-center max-w-[350px]'>
            <div className={`${styles['terminal-loader']}`}>
                <div className={`${styles['terminal-header']}`}>
                    <div className={`${styles['terminal-title']}`}>Status</div>
                    <div className={`${styles['terminal-controls']}`}>
                        <div className={`${styles['control close']}`}></div>
                        <div className={`${styles['control minimize']}`}></div>
                        <div className={`${styles['control maximize']}`}></div>
                    </div>
                </div>
                <div className={`${styles['text']}`}>Loading...</div>
            </div>


        </div>
    );
};

export default Loading;
