import React, { useEffect } from 'react';

type ModalConfirmProps = {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
};

const ModalConfirm: React.FC<ModalConfirmProps> = ({ show, onClose, onConfirm, message = 'Anda yakin ingin menghapus data ini?' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
        >
            <div className='fixed inset-0 bg-black opacity-30' onClick={() => onClose()}>
            </div>
            <div className='p-6 w-full max-w-lg z-30 relative'>
                <div className='animasiSembul w-full h-full flex flex-col items-center justify-center gap-3 shadow-lg bg-white p-5 rounded-lg transition'>
                    <img
                        src="/gifKomunitas2.gif"
                        alt="Preview"
                        style={{ maxWidth: 100, borderRadius: 8, display: 'block' }}
                    />
                    <h2 className='w-full text-center'>{message}</h2>
                    <button onClick={onConfirm} className='button-primary'>Ya!</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;
